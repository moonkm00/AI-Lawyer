package com.ailawyer.backend.report.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimilarContractDto {
    private Long contractId;
    private String title; // 계약서 제목/종류
    private Double similarityScore; // 유사도 점수 (0.0 ~ 1.0)
    private String preview; // 간단한 내용 미리보기
    private String content; // 전체 계약서 양식 내용 (추가)
}

