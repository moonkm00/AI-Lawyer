package com.ailawyer.backend.alert.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blacklist_keywords")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class BlacklistKeyword {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 감지할 치명적 키워드 (예: "지식재산권 전부 양도")
    @Column(nullable = false, unique = true)
    private String keyword;

    // 이 키워드가 왜 위험한지에 대한 사내 담당자 가이드
    private String warningMessage;

    // 위험도 (CRITICAL, HIGH 등)
    private String severity;
}
