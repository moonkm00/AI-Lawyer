package com.ailawyer.backend.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
public class AnalysisRequestDto {
    private String timestamp;

    @JsonProperty("fileName")
    private String fileName;

    private AnalysisResultDto result;
}
