package com.ailawyer.backend.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "\"Risk_Clause\"")
public class RiskClauseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "risk_clause_id")
    private Long riskClauseId;

    @Column(name = "contract_id")
    private Long contractId;

    @Column(name = "risk_title")
    private String riskTitle;

    @Column(name = "legal_base")
    private String legalBase;
}
