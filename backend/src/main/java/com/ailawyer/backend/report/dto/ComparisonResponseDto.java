package com.ailawyer.backend.report.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonResponseDto {
    private ContractInfo contractA;
    private ContractInfo contractB;
    private String recommendation; // 사용자에게 더 유리한 계약서 추천
    private boolean needsExpert;

    @Data @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContractInfo {
        private Long contractId;   // DB에 저장된 계약서 ID
        private String fileName;
        private String imgUrl;     // DB에 저장된 이미지(data URI)
        private List<String> pros; // 장점
        private List<String> cons; // 단점 및 리스크
        private int overallScore;
    }
}
