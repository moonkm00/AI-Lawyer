package com.ailawyer.backend.ai.service;

import com.ailawyer.backend.ai.dto.AnalysisResponseDto;
import com.ailawyer.backend.dashboard.dto.AnalysisItemDto;
import com.ailawyer.backend.dashboard.dto.AnalysisRequestDto;
import com.ailawyer.backend.dashboard.entity.AnalysisReportEntity;
import com.ailawyer.backend.dashboard.entity.CategoryEntity;
import com.ailawyer.backend.dashboard.entity.ContractsEntity;
import com.ailawyer.backend.dashboard.entity.RiskClauseEntity;
import com.ailawyer.backend.dashboard.repository.AnalysisReportRepository;
import com.ailawyer.backend.dashboard.repository.CategoryRepository;
import com.ailawyer.backend.dashboard.repository.ContractRepository;
import com.ailawyer.backend.dashboard.repository.RiskClauseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

import com.ailawyer.backend.auth.repository.UserRepository;
import com.ailawyer.backend.dashboard.entity.UserEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * [CORE] 지능형 분석 오케스트레이터
 * 데이터 추출, AI 분석 요청, DB 저장 및 결과 후처리를 총괄합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SmartAnalysisManager {

    private final DocumentParser documentParser;
    private final AiAnalysisService aiAnalysisService;

    // DB 저장을 위한 기존 대시보드 레포지토리 주입
    private final AnalysisReportRepository reportRepository;
    private final ContractRepository contractRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RiskClauseRepository riskClauseRepository;

    /**
     * 전체 분석 프로세스를 관리합니다. (PDF 텍스트 추출 혹은 이미지 직접 분석)
     */
    public AnalysisResponseDto processAnalysis(MultipartFile file, String mode) throws IOException {
        log.info("파일 분석 시작: {} (모드: {})", file.getOriginalFilename(), mode);
        String contentType = Objects.requireNonNull(file.getContentType());

        // 0. DB에서 현재 등록된 카테고리 목록 가져오기 (AI에게 힌트로 제공)
        String categoryList = categoryRepository.findAll().stream()
                .map(CategoryEntity::getCategoryName)
                .reduce((a, b) -> a + ", " + b)
                .orElse("근로/노무, 용역/프리랜서, 부동산/임대차, 기업/투자, 소비자/기타");

        AnalysisResponseDto result;
        if (contentType.equals("application/pdf")) {
            // 1. PDF인 경우 텍스트 추출 후 분석
            String rawText = documentParser.extractText(file);
            result = aiAnalysisService.analyze(rawText, categoryList, mode);
        } else if (contentType.startsWith("image/")) {
            // 2. 이미지인 경우 비전 모델로 직접 분석
            result = aiAnalysisService.analyzeImage(file.getBytes(), contentType, categoryList, mode);
        } else {
            throw new IllegalArgumentException("지원하지 않는 파일 형식입니다: " + contentType);
        }

        // 3. 분석 결과가 계약서인 경우 DB에 저장 (대표님 요청 사항)
        if (result != null && result.isContract()) {
            saveAnalysisToDb(result);
        }

        return result;
    }

    private void saveAnalysisToDb(AnalysisResponseDto result) {
        try {
            log.info("분석 결과를 Analysis_Report 테이블에 저장 중...");

            // 1) 현재 로그인된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = 1L; // 기본값 (폴백)

            if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
                String email = authentication.getName();
                userId = userRepository.findByEmail(email)
                        .map(UserEntity::getUserId)
                        .orElse(1L);
                log.info("인증된 사용자({})의 ID로 저장합니다.", email);
            } else {
                log.warn("인증 정보가 없습니다. 기본 ID(1)로 저장합니다.");
            }

            // 2) 카테고리 매핑 (DB에 존재하는 값만 사용)
            String docType = result.getDocumentType();
            CategoryEntity category = categoryRepository.findByCategoryName(docType)
                    .or(() -> categoryRepository.findByCategoryName("소비자/기타"))
                    .orElseGet(() -> categoryRepository.findAll().stream().findFirst().orElse(null));

            if (category == null) {
                log.warn("Category 테이블이 비어있거나 적절한 카테고리를 찾을 수 없습니다.");
            }

            // 3) 계약(Contract) 레코드 생성
            ContractsEntity contract = ContractsEntity.builder()
                    .category(category)
                    .userId(userId)
                    .imgUrl("uploaded_file")
                    .build();
            contractRepository.save(contract);

            // 4) 분석 리포트(AnalysisReport) 저장
            AnalysisReportEntity report = AnalysisReportEntity.builder()
                    .contract(contract)
                    .score(result.getRiskScore())
                    .penaltyScore(result.getDisadvantagePercentage())
                    .build();

            reportRepository.save(report);
            log.info("Analysis_Report 저장 완료. ID: {}", report.getReportId());

            // 5) 불공정 조항(riskClause) 저장
            log.info("불공정 조항(is_unfair = true) 필터링 및 지정 시작...");

            if (result.getAnalysisItems() != null) {
                for (AnalysisResponseDto.AnalysisItem item : result.getAnalysisItems()) {
                    if (item.isUnfair()) {
                        log.info("위험 조항 발견, 저장중: {}", item.getTopic());

                        RiskClauseEntity riskClause = RiskClauseEntity.builder()
                                .contractId(contract.getContractId())
                                .riskTitle(item.getTopic())
                                .legalBase(item.getLegalBase())
                                .build();

                        riskClauseRepository.save(riskClause);
                    } else {
                        log.debug("[정상 조항] 저장 제외: {}", item.getTopic());
                    }
                }
            }

        } catch (Exception e) {
            log.error("DB 저장 중 오류 발생 (분석은 계속 진행): {}", e.getMessage());
        }
    }

    /**
     * 분석 리포트 기반 대화형 질의응답 (RAG)
     */
    public String askQuestion(String contextKey, String question) {
        return aiAnalysisService.ask(contextKey, question);
    }
}
