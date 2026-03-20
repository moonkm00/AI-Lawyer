package com.ailawyer.backend.dashboard.projection;

public interface DailyTrendProjection {
    String getDate();
    String getCategoryName();
    Integer getDocCount();
}
