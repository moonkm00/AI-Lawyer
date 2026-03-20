package com.ailawyer.backend.alert.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "toxic_clause_alerts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ToxicClauseAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id")
    @JsonIgnore
    private ContractDocument contract;

    // 계약서에 명시된 불리한 원문 (독소조항)
    @Column(columnDefinition = "TEXT")
    private String originalClause; 

    // 이 조항이 그대로 진행되었을 때 "실제로 일어나는 문제점" (AI 분석결과)
    @Column(columnDefinition = "TEXT")
    private String realWorldProblem;

    // 표준 약관과 비교한 개선/대응 조언
    @Column(columnDefinition = "TEXT")
    private String recommendedAction; 

    // 위험도
    @Enumerated(EnumType.STRING)
    private Severity severity; 

    public enum Severity {
        CRITICAL, // 매우 치명적 (계약 거절 혹은 즉각 수정 필요)
        HIGH,     // 위험 (수정 권고)
        MEDIUM    // 불리함 (협상 필요)
    }
}
