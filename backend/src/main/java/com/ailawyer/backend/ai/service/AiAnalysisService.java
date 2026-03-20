package com.ailawyer.backend.ai.service;

import com.ailawyer.backend.ai.dto.AnalysisResponseDto;
import dev.langchain4j.data.image.Image;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.PostConstruct;
import java.util.Base64;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Duration;

@Slf4j
@Service
public class AiAnalysisService {

    @Value("${google.ai.api.key}")
    private String geminiApiKey;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1}")
    private String groqApiUrl;

    private final AnalysisContextManager contextManager;
    private AiLegalAssistant geminiAssistant;
    private AiLegalAssistant geminiVisionAssistant;
    private AiLegalAssistant groqAssistant;

    public AiAnalysisService(AnalysisContextManager contextManager) {
        this.contextManager = contextManager;
    }

    @PostConstruct
    public void init() {
        if (geminiApiKey != null && !geminiApiKey.isEmpty()) {
            initGemini();
        }
        if (groqApiKey != null && !groqApiKey.isEmpty()) {
            initGroq();
        }
    }

    private void initGemini() {
        try {
            log.info("Google Gemini 모델 초기화 중...");

            this.geminiAssistant = AiServices.builder(AiLegalAssistant.class)
                    .chatLanguageModel(GoogleAiGeminiChatModel.builder()
                            .apiKey(geminiApiKey)
                            .modelName("gemini-2.5-flash")
                            .temperature(0.1) // 계약서 분석의 정확도를 높이기 위해 추가
                            .timeout(Duration.ofSeconds(120)) // ★ 타임아웃을 120초로 넉넉하게 연장
                            .maxRetries(0) // ★ 자동 재시도 차단 (429 에러의 핵심 원인 해결)
                            .logRequestsAndResponses(true)
                            .build())
                    .build();

            this.geminiVisionAssistant = AiServices.builder(AiLegalAssistant.class)
                    .chatLanguageModel(GoogleAiGeminiChatModel.builder()
                            .apiKey(geminiApiKey)
                            .modelName("gemini-2.5-flash")
                            .temperature(0.1)
                            .timeout(Duration.ofSeconds(120)) // ★ 비전 모델도 동일하게 연장
                            .maxRetries(0) // ★ 자동 재시도 차단
                            .logRequestsAndResponses(true)
                            .build())
                    .build();

            log.info("Gemini 모델 초기화 완료 (상세 분석용)");
        } catch (Exception e) {
            log.error("Gemini 초기화 실패: {}", e.getMessage());
        }
    }

    private void initGroq() {
        try {
            log.info("Groq 모델 초기화 중...");

            dev.langchain4j.model.openai.OpenAiChatModel groqModel = dev.langchain4j.model.openai.OpenAiChatModel
                    .builder()
                    .apiKey(groqApiKey)
                    .baseUrl(groqApiUrl)
                    .modelName("llama-3.3-70b-versatile")
                    .maxTokens(1024)
                    .build();

            this.groqAssistant = AiServices.builder(AiLegalAssistant.class)
                    .chatLanguageModel(groqModel)
                    .build();

            log.info("Groq 모델 초기화 완료 (심플 분석용)");
        } catch (Exception e) {
            log.error("Groq 초기화 실패: {}", e.getMessage());
        }
    }

    public AnalysisResponseDto analyze(String extractedText, String categoryList, String mode) {
        boolean isDetailed = "detailed".equalsIgnoreCase(mode);
        log.info("AI 분석 시작 | 모드: {} | 엔진: {}", mode, isDetailed ? "Gemini" : "Groq");

        try {
            AiLegalAssistant assistant;

            // 1. 요청된 모드에 맞춰 정확히 해당 엔진만 선택 (바꿔치기 금지!)
            if (isDetailed) {
                if (geminiAssistant == null) {
                    throw new IllegalStateException("Gemini AI 서비스가 초기화되지 않았습니다. API 키를 확인하세요.");
                }
                assistant = geminiAssistant;
            } else {
                if (groqAssistant == null) {
                    throw new IllegalStateException("Groq AI 서비스가 초기화되지 않았습니다. .env 파일의 GROQ_API_KEY를 확인하세요.");
                }
                assistant = groqAssistant;
            }

            AnalysisResponseDto response = assistant.analyzeContract(extractedText, categoryList);
            log.info("AI 텍스트 분석 완료 (엔진: {})", isDetailed ? "Gemini" : "Groq");
            return response;

        } catch (Exception e) {
            log.error("AI 분석 중 오류: {}", e.getMessage());
            throw new RuntimeException("AI 분석 중 오류가 발생했습니다.", e);
        }
    }

    public AnalysisResponseDto analyzeImage(byte[] imageBytes, String mimeType, String categoryList, String mode) {
        boolean isDetailed = "detailed".equalsIgnoreCase(mode);
        log.info("AI 이미지 분석 시작 | 모드: {} | 엔진: {}", mode, isDetailed ? "Gemini Vision" : "Groq");

        try {
            AiLegalAssistant assistant;

            if (isDetailed) {
                if (geminiVisionAssistant == null) {
                    throw new IllegalStateException("Gemini 비전 서비스가 초기화되지 않았습니다.");
                }
                assistant = geminiVisionAssistant;
            } else {
                if (groqAssistant == null) {
                    throw new IllegalStateException("Groq AI 서비스가 초기화되지 않았습니다.");
                }
                assistant = groqAssistant;
            }

            Image image = Image.builder()
                    .base64Data(Base64.getEncoder().encodeToString(imageBytes))
                    .mimeType(mimeType)
                    .build();

            AnalysisResponseDto response = assistant.analyzeContractImage(image, categoryList);
            log.info("AI 이미지 분석 완료");
            return response;

        } catch (Exception e) {
            log.error("AI 이미지 분석 중 오류: {}", e.getMessage());
            throw new RuntimeException("이미지 분석 중 오류가 발생했습니다.", e);
        }
    }

    public String ask(String contextKey, String question) {
        String context = contextManager.getContext(contextKey);
        log.info("AI 질의응답 시작... 사용자(Key): {}, 질문: {}", contextKey, question);
        try {
            if (geminiAssistant == null) {
                return "AI 모델이 준비되지 않았습니다.";
            }
            return geminiAssistant.answerLegalQuestion(context, question);
        } catch (Exception e) {
            log.error("AI 답변 생성 중 오류 발생: {}", e.getMessage(), e);
            return "답변 생성 중 오류가 발생했습니다: " + e.getMessage();
        }
    }
}
