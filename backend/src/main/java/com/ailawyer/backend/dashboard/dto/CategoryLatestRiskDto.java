package com.ailawyer.backend.dashboard.dto;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter

public class CategoryLatestRiskDto {
    private String riskTitle;
    private String legalBase;
}
