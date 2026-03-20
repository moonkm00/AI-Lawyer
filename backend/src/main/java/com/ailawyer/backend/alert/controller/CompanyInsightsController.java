package com.ailawyer.backend.alert.controller;

import com.ailawyer.backend.alert.entity.BlacklistKeyword;
import com.ailawyer.backend.alert.service.CompanyInsightsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insights")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CompanyInsightsController {

    private final CompanyInsightsService insightService;

    // ----- [1. 전수 조사 및 통계 통계 API 반환 포맷] -----
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCompanyStats() {
        return ResponseEntity.ok(insightService.getCompanyContractStatistics());
    }

    // ----- [2. 커스텀 블랙리스트 키워드 세팅 및 조회 API] -----
    @GetMapping("/blacklist-keywords")
    public ResponseEntity<List<BlacklistKeyword>> getKeywords() {
        return ResponseEntity.ok(insightService.getAllKeywords());
    }

    public record AddKeywordRequest(String keyword, String warningMessage, String severity) {}

    @PostMapping("/blacklist-keywords")
    public ResponseEntity<BlacklistKeyword> addKeyword(@RequestBody AddKeywordRequest req) {
        return ResponseEntity.ok(insightService.addKeyword(req.keyword(), req.warningMessage(), req.severity()));
    }

    // ----- [3. 계약 체결 전 블랙리스트 키워드 사전 검사 및 경고 (JSON 반환)] -----
    public record ScanBlacklistRequest(String documentText) {}

    @PostMapping("/scan-blacklist")
    public ResponseEntity<?> scanDocumentForBlacklist(@RequestBody ScanBlacklistRequest request) {
        List<Map<String, String>> detected = insightService.scanForBlacklistKeywords(request.documentText());
        return ResponseEntity.ok(Map.of(
            "status", detected.isEmpty() ? "SAFE" : "WARNING",
            "detectedKeywords", detected
        ));
    }

    // ----- [4. 갱신/종료 알림 모의 통지 API (JSON 반환)] -----
    @GetMapping("/renewal-mock-trigger")
    public ResponseEntity<?> triggerRenewalNotification() {
        // 실제로는 매일 도는 스케줄러가 JSON 알림을 쌓지만, 테스트를 위해 즉시 리턴
        Map<String, Object> mockNotificationJson = Map.of(
            "receiverId", "legal_team_leader",
            "sourceSystem", "RENEWAL_SCHEDULER",
            "title", "⏰ 독소조항 계약 갱신 시기 도래: 빠른 조치 요망",
            "message", "'A사 라이선스 연장 계약'의 갱신일이 30일 남았습니다. 이 계약엔 '해지권 제한' 독소조항이 포함되어 있습니다. 이번 갱신 시점에 반드시 조건을 변경하여 체결하시기 바랍니다.",
            "severity", "HIGH",
            "referenceLink", "/analysis/detail"
        );
        return ResponseEntity.ok(mockNotificationJson);
    }
}
