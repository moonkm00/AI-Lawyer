package com.ailawyer.backend.dashboard.controller;

import com.ailawyer.backend.dashboard.projection.CategoryContractProjection;
import com.ailawyer.backend.dashboard.projection.RiskAvgProjection;
import com.ailawyer.backend.dashboard.projection.TopCategoryProjection;
import com.ailawyer.backend.dashboard.service.AnalysisReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class AnalysisReportController {

    private final AnalysisReportService service;

    // risk_score, disadvantagepercent 평균
    @GetMapping("/averages/overall")
    public ResponseEntity<RiskAvgProjection> getRiskAverages() {
        RiskAvgProjection result = service.getRiskAverages();
        return ResponseEntity.ok(result);
    }
    // 지금까지 분석한 걔약서 수가 몇개인가 - count(contract_id)
    @GetMapping("contracts/overall")
    public ResponseEntity<Long> getCountContractId() {
        Long result = service.getCountContractId();
        return ResponseEntity.ok(result);
    }
    // 카테고리별 계약서가 몇개인가 - count(contract_id) + groupby contract_id
    @GetMapping("contracts/category")
    public ResponseEntity<List<CategoryContractProjection>> getContractCountByCategory() {
        List<CategoryContractProjection> result = service.getContractCountByCategory();
        return ResponseEntity.ok(result);
    }
    // 위험도 top-5 카테고리 가져오기
    @GetMapping("categories/top")
    public ResponseEntity<List<TopCategoryProjection>> getTopCategories(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(service.getTopCategories(limit));
    }
    
    // 날짜별 파이프라인(분석량) 트렌드
    @GetMapping("contracts/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailyTrends() {
        return ResponseEntity.ok(service.getDailyTrends());
    }
}
