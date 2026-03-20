package com.ailawyer.backend.ai.controller;

import com.ailawyer.backend.ai.dto.AnalysisResponseDto;
import com.ailawyer.backend.ai.service.AnalysisContextManager;
import com.ailawyer.backend.ai.service.SmartAnalysisManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final SmartAnalysisManager analysisManager;
    private final AnalysisContextManager contextManager;

    /**
     * [CORE] 계약서 업로드 및 분석 요청
     * 신뢰성(비식별화), 보안(휘발성), AI 리포트를 일괄 반환합니다.
     */
    @PostMapping(value = "/upload")
    public ResponseEntity<?> uploadAndAnalyze(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "mode", defaultValue = "detailed") String mode) {
        log.info("==> [API 요청] /api/analysis/upload | 모드: {}", mode);
        try {
            if (file == null || file.isEmpty()) {
                log.warn("파일이 비어있거나 누락됨");
                return ResponseEntity.badRequest().body(Map.of("error", "파일이 없습니다."));
            }
            log.info("파일 이름: {}, 크기: {}", file.getOriginalFilename(), file.getSize());

            // [대표님 요청 사항] 빠른 분석(simple) 모드 시 PDF 파일만 업로드 가능하도록 제한 (Groq 스펙 반영)
            if ("simple".equalsIgnoreCase(mode)) {
                String contentType = file.getContentType();
                if (!"application/pdf".equalsIgnoreCase(contentType)) {
                    log.warn("빠른 분석 모드에서 PDF가 아닌 파일 업로드 시도: {}", contentType);
                    return ResponseEntity.badRequest().body(Map.of(
                            "error", "빠른 분석은 PDF 파일만 분석 가능합니다.",
                            "details", "PDF 파일로 다시 업로드하시거나, 정밀 분석 모드를 이용해 주세요."));
                }
            }

            AnalysisResponseDto result = analysisManager.processAnalysis(file, mode);

            // 결과가 계약서가 아닌 경우 차단 및 안내
            if (!result.isContract()) {
                log.warn("업로드된 문서가 계약서가 아님: {}", file.getOriginalFilename());
                contextManager.clearContext("default");
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "업로드하신 문서는 법적 계약서가 아닌 것으로 분석되었습니다.",
                        "details", "정밀한 분석을 위해 근로계약서, 임대차계약서 등 실제 계약 문서를 다시 업로드해 주세요."));
            }

            // 계약서로 판별된 경우 컨텍스트 저장 (사용자별 독립 컨텍스트)
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String contextKey = (auth != null && auth.isAuthenticated()) ? auth.getName() : "default";
            contextManager.saveContext(contextKey, result.toString());

            // [대표님 요청 사항] 최종 JSON 응답 레이아웃 구성
            Map<String, Object> finalResponse = Map.of(
                    "timestamp", java.time.ZonedDateTime.now().toString(),
                    "fileName", file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown",
                    "fileType", file.getContentType() != null ? file.getContentType() : "application/octet-stream",
                    "result", result);

            return ResponseEntity.ok(finalResponse);
        } catch (Exception e) {
            log.error("처리 중 오류 발생", e);
            String errorMessage = e.getMessage();

            // Google AI API (Gemini) 할당량 초과 처리 (429 에러)
            if (errorMessage != null && errorMessage.contains("429")) {
                return ResponseEntity.status(429).body(Map.of(
                        "error", "현재 AI 서비스 요청이 너무 많습니다 (할당량 초과).",
                        "details", "Google AI API 무료 티어 제한으로 인해 일시적으로 요청을 처리할 수 없습니다. 약 1분 후 다시 시도해 주세요."));
            }

            return ResponseEntity.status(500).body(Map.of(
                    "error", "서버 내부 오류가 발생했습니다.",
                    "details", errorMessage != null ? errorMessage : "알 수 없는 오류"));
        }
    }

    /**
     * [CORE] 대화형 질의응답 (Interactive Legal Q&A)
     * 분석 결과를 바탕으로 RAG 챗봇과 대화합니다.
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String contextKey = (auth != null && auth.isAuthenticated()) ? auth.getName() : "default";

        String answer = analysisManager.askQuestion(contextKey, question);
        return ResponseEntity.ok(Map.of("answer", answer));
    }
}
