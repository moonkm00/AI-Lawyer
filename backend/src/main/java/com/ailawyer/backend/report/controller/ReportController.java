package com.ailawyer.backend.report.controller;

import com.ailawyer.backend.ai.dto.AnalysisResponseDto;
import com.ailawyer.backend.ai.service.SmartAnalysisManager;
import com.ailawyer.backend.dashboard.entity.ContractsEntity;
import com.ailawyer.backend.dashboard.repository.ContractRepository;
import com.ailawyer.backend.report.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.ailawyer.backend.auth.repository.UserRepository;
import com.ailawyer.backend.dashboard.entity.UserEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프런트엔드 연동을 위해 CORS 허용
public class ReportController {

    private final SmartAnalysisManager smartAnalysisManager;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;

    /**
     * [A/B Test] 두 개의 계약서를 비교 분석합니다.
     */
    @PostMapping("/compare")
    public ResponseEntity<?> compare(
            @RequestParam("fileA") MultipartFile fileA,
            @RequestParam("fileB") MultipartFile fileB) {
        
        log.info("==> [API 요청] /api/reports/compare - FileA: {}, FileB: {}", 
                fileA.getOriginalFilename(), fileB.getOriginalFilename());

        try {
            // 파일 유효성 검사
            if (fileA == null || fileA.isEmpty() || fileB == null || fileB.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "두 개의 파일을 모두 업로드해야 합니다."));
            }

            // 1. AI 분석 (내부적으로 DB 저장 수행)
            AnalysisResponseDto analysisA = smartAnalysisManager.processAnalysis(fileA, "detailed");
            AnalysisResponseDto analysisB = smartAnalysisManager.processAnalysis(fileB, "detailed");

            // 방금 저장된 Contract를 찾아서 응답에 ID/이미지까지 포함
            // 1) 현재 로그인된 사용자 ID 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = 1L; // 폴백
            if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
                userId = userRepository.findByEmail(authentication.getName())
                        .map(UserEntity::getUserId)
                        .orElse(1L);
            }

            List<ContractsEntity> contracts = contractRepository.findByUserId(userId);
            ContractsEntity latestA = contracts.isEmpty() ? null : contracts.get(contracts.size() - 2 < 0 ? 0 : contracts.size() - 2);
            ContractsEntity latestB = contracts.isEmpty() ? null : contracts.get(contracts.size() - 1);

            // 2. 분석 결과를 비교 리포트 형식으로 변환
            ComparisonResponseDto result = ComparisonResponseDto.builder()
                    .contractA(ComparisonResponseDto.ContractInfo.builder()
                            .contractId(latestA == null ? null : latestA.getContractId())
                            .fileName(fileA.getOriginalFilename())
                            .imgUrl(latestA == null ? null : latestA.getImgUrl())
                            .pros(buildPros(analysisA))
                            .cons(buildCons(analysisA))
                            .overallScore(analysisA.getRiskScore())
                            .build())
                    .contractB(ComparisonResponseDto.ContractInfo.builder()
                            .contractId(latestB == null ? null : latestB.getContractId())
                            .fileName(fileB.getOriginalFilename())
                            .imgUrl(latestB == null ? null : latestB.getImgUrl())
                            .pros(buildPros(analysisB))
                            .cons(buildCons(analysisB))
                            .overallScore(analysisB.getRiskScore())
                            .build())
                    .recommendation(analysisA.getRiskScore() > analysisB.getRiskScore() 
                            ? "계약서 A가 " + (analysisA.getRiskScore() - analysisB.getRiskScore()) + "점 더 높은 점수를 받았습니다."
                            : "계약서 B가 " + (analysisB.getRiskScore() - analysisA.getRiskScore()) + "점 더 높은 점수를 받았습니다.")
                    .needsExpert(analysisA.getRiskScore() < 80 || analysisB.getRiskScore() < 80)
                    .build();

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("비교 분석 중 오류 발생", e);
            String errorMessage = e.getMessage();

            if (errorMessage != null && errorMessage.contains("429")) {
                return ResponseEntity.status(429).body(Map.of(
                        "error", "현재 AI 서비스 요청이 너무 많습니다 (할당량 초과).",
                        "details", "Google AI API 무료 티어 제한으로 인해 일시적으로 요청을 처리할 수 없습니다. 다시 시도해 주세요."));
            }

            return ResponseEntity.status(500).body(Map.of(
                    "error", "비교 분석 중 오류가 발생했습니다.",
                    "details", errorMessage != null ? errorMessage : "알 수 없는 오류"));
        }
    }

    private List<String> buildPros(AnalysisResponseDto analysis) {
        List<AnalysisResponseDto.AnalysisItem> items =
                analysis.getAnalysisItems() == null ? List.of() : analysis.getAnalysisItems();

        long unfairCount = items.stream().filter(AnalysisResponseDto.AnalysisItem::isUnfair).count();

        List<String> pros = new ArrayList<>();
        pros.add("종합 점수 " + analysis.getRiskScore() + "점");

        String docType = emptyToNull(analysis.getDocumentType());
        if (docType != null) pros.add("문서 유형: " + docType);

//        String language = emptyToNull(analysis.getLanguage());
//        if (language != null) pros.add("언어: " + language);

        if (!items.isEmpty()) {
            pros.add("불공정 조항 탐색: " + unfairCount + "건 발견");
        } else {
            pros.add("분석된 조항이 없습니다.");
        }

        if (analysis.getRiskScore() >= 85) pros.add("전반적으로 공정한 계약입니다.");
        else if (analysis.getRiskScore() >= 70) pros.add("일부 조항은 점검이 필요합니다.");
        else pros.add("불공정 리스크가 커서 수정/협상이 강력히 권장됩니다.");

        return pros;
    }

    private List<String> buildCons(AnalysisResponseDto analysis) {
        List<AnalysisResponseDto.AnalysisItem> items =
                analysis.getAnalysisItems() == null ? List.of() : analysis.getAnalysisItems();

        return items.stream()
                .filter(AnalysisResponseDto.AnalysisItem::isUnfair)
                .limit(3)
                .map(item -> {
                    String topic = emptyToNull(item.getTopic());
                    String explanation = emptyToNull(item.getExplanation());
                    
                    if (explanation != null && explanation.length() > 60) explanation = explanation.substring(0, 60) + "…";

                    return "[" + topic + "] " + (explanation != null ? explanation : "주의가 필요한 조항입니다.");
                })
                .collect(Collectors.toList());
    }

    private static String emptyToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    /**
     * [Similarity Search] 업로드된 계약서와 유사한 기존 계약서들을 검색합니다.
     */
    @PostMapping("/similar-search")
    public ResponseEntity<List<SimilarContractDto>> searchSimilar(
            @RequestParam("file") MultipartFile file) {
        
        log.info("==> [API 요청] /api/reports/similar-search - File: {}", file.getOriginalFilename());

        // MOCK DATA: 유사 계약서 3종
        List<SimilarContractDto> similarContracts = List.of(
            SimilarContractDto.builder()
                .contractId(101L)
                .title("표준 주택 임대차 계약서 (2024)")
                .similarityScore(0.95)
                .preview("임대인이 수선 의무를 전적으로 부담하며, 보증금 보호 조항이 강화된 표준 모델입니다.")
                .content("[표준 주택 임대차 계약서] ...")
                .build(),
            SimilarContractDto.builder()
                .contractId(102L)
                .title("서울시 안심 전세 계약 가이드")
                .similarityScore(0.88)
                .preview("전세 사기 예방을 위한 특약 사항이 포함되어 있습니다.")
                .content("[서울시 안심 전세 특약 가이드] ...")
                .build()
        );

        return ResponseEntity.ok(similarContracts);
    }

    /**
     * 전문가 추천 API (3인)
     */
    @GetMapping("/{reportId}/recommended-experts")
    public ResponseEntity<List<ExpertResponseDto>> getExperts(@PathVariable Long reportId) {
        log.info("==> [API 요청] /api/reports/{}/recommended-experts", reportId);
        
        List<ExpertResponseDto> experts = List.of(
            ExpertResponseDto.builder()
                .expertName("강민수 변호사")
                .profession("변호사")
                .specialty("상가 임대차 / 민사 전담")
                .matchScore(98.5)
                .topReviewTags(List.of("친절함", "정확한 분석"))
                .build()
        );
        
        return ResponseEntity.ok(experts);
    }
}
