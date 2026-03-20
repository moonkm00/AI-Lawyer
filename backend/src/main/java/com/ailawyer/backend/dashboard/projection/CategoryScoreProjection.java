package com.ailawyer.backend.dashboard.projection;

public interface CategoryScoreProjection {
    String getCategoryName();
    Double getAvgRiskScore();
    Double getAvgDisadvantagePercent();
}
