package com.ailawyer.backend.dashboard.service;

import com.ailawyer.backend.dashboard.projection.CategoryContractProjection;
import com.ailawyer.backend.dashboard.projection.RiskAvgProjection;
import com.ailawyer.backend.dashboard.projection.TopCategoryProjection;
import com.ailawyer.backend.dashboard.repository.AnalysisReportRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import com.ailawyer.backend.dashboard.projection.DailyTrendProjection;

@Service
public class AnalysisReportService {

    private final AnalysisReportRepository repository;

    public AnalysisReportService(AnalysisReportRepository repository) {
        this.repository = repository;
    }

    public RiskAvgProjection getRiskAverages() {
        return repository.findRiskAverages();
    }

    public Long getCountContractId() {
        return repository.findCountContractId();
    }

    public List<CategoryContractProjection> getContractCountByCategory() {
        return repository.findContractCountByCategory();
    }

    public List<TopCategoryProjection> getTopCategories(int limit) {
        return repository.findTopCategories(limit);
    }

    public List<Map<String, Object>> getDailyTrends() {
        List<DailyTrendProjection> projections = repository.findDailyTrends();
        
        Map<String, Map<String, Object>> grouped = new LinkedHashMap<>();
        LocalDate now = LocalDate.now();
        for (int i = 13; i >= 0; i--) {
            String dateStr = now.minusDays(i).format(DateTimeFormatter.ofPattern("MM.dd"));
            Map<String, Object> map = new HashMap<>();
            map.put("date", dateStr);
            map.put("Total", 0);
            grouped.put(dateStr, map);
        }
        
        for (DailyTrendProjection proj : projections) {
            String date = proj.getDate();
            if(!grouped.containsKey(date)) {
                Map<String, Object> defaultMap = new HashMap<>();
                defaultMap.put("date", date);
                defaultMap.put("Total", 0);
                grouped.put(date, defaultMap);
            }
            Map<String, Object> map = grouped.get(date);
            String category = proj.getCategoryName() != null ? proj.getCategoryName() : "Unknown";
            
            map.put(category, proj.getDocCount());
            
            int currentTotal = (Integer) map.getOrDefault("Total", 0);
            map.put("Total", currentTotal + proj.getDocCount());
        }
        
        return new ArrayList<>(grouped.values());
    }

}
