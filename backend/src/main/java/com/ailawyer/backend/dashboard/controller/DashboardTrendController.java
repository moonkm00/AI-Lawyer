package com.ailawyer.backend.dashboard.controller;

import com.ailawyer.backend.dashboard.dto.TrendDto;
import com.ailawyer.backend.dashboard.service.DashboardTrendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/trends")
@RequiredArgsConstructor
public class DashboardTrendController {

    private final DashboardTrendService dashboardTrendService;

    @GetMapping("monthly")
    public ResponseEntity<List<TrendDto>> getMonthlyTrends() {
        return ResponseEntity.ok(dashboardTrendService.getLast30DaysTrend());
    }
}
