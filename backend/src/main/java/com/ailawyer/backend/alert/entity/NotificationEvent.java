package com.ailawyer.backend.alert.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_events")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 알림을 받을 사용자 ID 혹은 그룹
    private String receiverId;

    // 알림을 보낸 시스템 (예: AI_ANALYSIS_ENGINE, DEADLINE_SCHEDULER 등)
    private String sourceSystem;

    // 알림 제목
    private String title;

    // 알림 내용 (가공된 상세 문제점 등)
    @Column(columnDefinition = "TEXT")
    private String message;

    // 치명도 (CRITICAL, HIGH, INFO)
    private String severity;

    // 관련된 문서나 처리 페이지로 갈 수 있는 링크
    private String referenceLink;

    // 알림 수신 시간
    private LocalDateTime eventTime;

    // 읽음 여부
    @Builder.Default
    private boolean isRead = false;
}
