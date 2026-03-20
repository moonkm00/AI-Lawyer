package com.ailawyer.backend.alert.controller;

import com.ailawyer.backend.alert.entity.NotificationEvent;
import com.ailawyer.backend.alert.repository.NotificationEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class NotificationEventController {

    private final NotificationEventRepository repository;

    /**
     * 1. 다른 팀원(혹은 다른 시스템)이 AI 결과를 JSON 포맷으로 보내주는 REST Endpoint
     */
    @PostMapping("/send")
    public ResponseEntity<NotificationEvent> receiveJsonNotification(@RequestBody NotificationEvent requestPayload) {
        log.info("새로운 알림 수신: {}", requestPayload.getTitle());

        // 이벤트 시간 자동 기록
        requestPayload.setEventTime(LocalDateTime.now());
        requestPayload.setRead(false);

        // 치명도가 비어있으면 기본값 INFO 할당
        if (requestPayload.getSeverity() == null) {
            requestPayload.setSeverity("INFO");
        }

        NotificationEvent savedEvent = repository.save(requestPayload);
        return ResponseEntity.ok(savedEvent);
    }

    /**
     * 2. 프론트엔드 모니터링 시스템에서 알림 리스트를 뿌려주기 위한 엔드포인트
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationEvent>> getUserNotifications(@PathVariable String userId) {
        List<NotificationEvent> notifications = repository.findByReceiverIdOrderByEventTimeDesc(userId);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * 3. 알림 읽음 처리
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        repository.findById(id).ifPresent(event -> {
            event.setRead(true);
            repository.save(event);
        });
        return ResponseEntity.ok().build();
    }

    /**
     * 4. [방안 B] 다수의 독소조항을 배열로 받아 하나의 '통합 알림'으로 가공하는 엔드포인트
     */
    public record ToxicClauseItem(String clauseName, String severity) {}
    
    public record BulkAnalysisPayload(
            String receiverId,
            String contractId,
            String contractName,
            List<ToxicClauseItem> toxicClauses
    ) {}

    @PostMapping("/send/bulk-analysis")
    public ResponseEntity<NotificationEvent> receiveBulkAnalysis(@RequestBody BulkAnalysisPayload payload) {
        log.info("통합 분석 알림 수신: {} 문서에 {}개의 독소조항 감지", payload.contractName(), payload.toxicClauses().size());

        if (payload.toxicClauses() == null || payload.toxicClauses().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 전체 치명도 산정 (하나라도 CRITICAL이 있다면 알림도 CRITICAL)
        boolean hasCritical = payload.toxicClauses().stream()
                .anyMatch(c -> "CRITICAL".equalsIgnoreCase(c.severity()));
        boolean hasHigh = payload.toxicClauses().stream()
                .anyMatch(c -> "HIGH".equalsIgnoreCase(c.severity()));
        
        String overallSeverity = hasCritical ? "CRITICAL" : (hasHigh ? "HIGH" : "MEDIUM");

        // UI에 보여줄 통합 요약 메시지 생성
        StringBuilder summaryMessage = new StringBuilder();
        summaryMessage.append("AI 시스템이 계약서 분석을 완료했습니다. 총 ")
                      .append(payload.toxicClauses().size())
                      .append("개의 잠재적 위험 독소조항이 발견되었습니다.\n\n");
        
        for (int i = 0; i < payload.toxicClauses().size(); i++) {
            ToxicClauseItem item = payload.toxicClauses().get(i);
            summaryMessage.append(i + 1).append(". ").append(item.clauseName())
                          .append(" (").append(item.severity()).append(")\n");
        }
        summaryMessage.append("\n상세 스캐너 화면으로 이동하여 실제 발생할 피해 시나리오와 대안을 검토하세요.");

        // 최종 알림 객체 생성
        NotificationEvent summaryEvent = NotificationEvent.builder()
                .receiverId(payload.receiverId())
                .sourceSystem("AI_BULK_ENGINE")
                .title("🚨 '" + payload.contractName() + "'에서 " + payload.toxicClauses().size() + "개의 독소조항 감지!")
                .message(summaryMessage.toString())
                .severity(overallSeverity)
                .referenceLink("/analysis/" + payload.contractId()) // 다건을 모아볼 수 있는 고유 링크 매핑
                .eventTime(LocalDateTime.now())
                .isRead(false)
                .build();

        NotificationEvent savedEvent = repository.save(summaryEvent);
        return ResponseEntity.ok(savedEvent);
    }
}
