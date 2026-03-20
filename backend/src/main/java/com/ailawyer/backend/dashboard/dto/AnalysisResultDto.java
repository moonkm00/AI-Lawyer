package com.ailawyer.backend.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
public class AnalysisResultDto {
    @JsonProperty("document_type")
    private String documentType;

    @JsonProperty("risk_score")
    private Integer riskScore;

    @JsonProperty("disadvantage_percentage")
    private Integer disadvantagePercentage;

    @JsonProperty("analysis_items")
    private List<AnalysisItemDto> analysisItems;
}
