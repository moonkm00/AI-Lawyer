package com.ailawyer.backend.dashboard.projection;

// Native Query에서 카테고리별 계약 수를 매핑하기 위한 Projection
public interface CategoryContractProjection {
    String getCategoryName();
    Long getContractCount();
}
