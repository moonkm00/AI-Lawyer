package com.ailawyer.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendDto {
    private String date; // E.g., "MM-dd" Format
    private int totalContracts;
    private int saasContracts;
    private int ndaContracts;
    private int employmentContracts;
}
