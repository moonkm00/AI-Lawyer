package com.ailawyer.backend.dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "\"Analysis_Report\"")
public class AnalysisReportEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private ContractsEntity contract;

    @Column(name = "score")
    private Integer score;

    @Column (name = "penalty_score")
    private Integer penaltyScore;
}
