package com.ailawyer.backend.dashboard.projection;

// 네이티브 쿼리를 써야해서 Projection
public interface TopCategoryProjection {
    Integer getCategoryId();
    String getCategoryName();
    Double getAvgRiskScore();
    Double getAvgDisadvantagePercent();
    Integer getRiskClauseCount();
}
