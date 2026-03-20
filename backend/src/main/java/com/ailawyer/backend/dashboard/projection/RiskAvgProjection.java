package com.ailawyer.backend.dashboard.projection;

// 1행에 필요한 전체 계약서 risk_score, disadvantage_percent 평균점수
// Projection을 쓰는 이유는 필요한 칼럼만 가져오는게 더 빠르니까
public interface RiskAvgProjection {
    Double getAvgRiskScore();
    Double getAvgDisadvantagePercent();
}
