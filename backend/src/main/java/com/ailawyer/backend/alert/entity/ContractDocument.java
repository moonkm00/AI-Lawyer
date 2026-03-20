package com.ailawyer.backend.alert.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contract_documents")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ContractDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 계약서 이름 (예: 프리랜서 외주 개발 계약서)
    private String title;
    
    // 계약서 종류
    private String documentType;

    private LocalDateTime uploadDate;

    // 계약서 한 장에 발견된 여러 독소조항들
    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ToxicClauseAlert> toxicClauses = new ArrayList<>();
}
