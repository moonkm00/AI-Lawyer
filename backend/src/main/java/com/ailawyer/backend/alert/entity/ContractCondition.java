package com.ailawyer.backend.alert.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "contract_conditions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ContractCondition {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contractName;
    
    // 조건 발동 상황 (ex. 납기 5일 전)
    private String triggerCondition; 
    
    // 주요 기한
    private LocalDate deadlineDate; 
    
    // 알림 내용 (ex. 미준수 시 30% 위약금 발생)
    private String actionRequired; 

    @Enumerated(EnumType.STRING)
    private Status status; 

    public enum Status {
        PENDING,   // 알림 대기중
        NOTIFIED,  // 알림 발송됨
        COMPLETED  // 해결됨
    }
}
