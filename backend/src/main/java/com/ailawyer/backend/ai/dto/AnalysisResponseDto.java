package com.ailawyer.backend.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

/**
 * 대표님께서 요청하신 JSON 규격에 맞춘 AI 분석 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AnalysisResponseDto {

    @JsonProperty("is_contract")
    private boolean isContract; // 내부 판별용

    @JsonProperty("document_type")
    private String documentType; // 계약서 종류

    @JsonProperty("risk_score")
    private int riskScore; // 위험도 점수

    @JsonProperty("disadvantage_percentage")
    private int disadvantagePercentage; // 사용자 불리 지수

    @JsonProperty("deadline_date")
    private String deadlineDate; // [대표님 요청] AI가 추출한 계약 마감일/종료일 (ISO 8601 형식 권장)

    private String summary; // 전체 요약 내역

    @JsonProperty("analysis_items")
    private List<AnalysisItem> analysisItems; // 세부 분석 항목

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class AnalysisItem {
        private String topic; // 분석 주제
        private String clause; // 해당 조항 원문
        
        @JsonProperty("is_unfair")
        private boolean isUnfair; // 불공정 여부
        
        private String explanation; // 상세 설명
        
        @JsonProperty("legal_base")
        private String legalBase; // 법적 근거 (예: 근로기준법 제17조)
        
        @JsonProperty("negotiation_script")
        private String negotiationScript; // 권장 협상 스크립트
    }
}
