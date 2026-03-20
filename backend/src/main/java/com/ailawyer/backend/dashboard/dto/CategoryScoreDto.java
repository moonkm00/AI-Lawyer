package com.ailawyer.backend.dashboard.dto;

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

public class CategoryScoreDto {
    private String categoryName;
    private Double avgScore;
    private Double avgPenaltyScore;
}
