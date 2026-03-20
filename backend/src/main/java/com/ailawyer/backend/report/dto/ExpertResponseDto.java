package com.ailawyer.backend.report.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertResponseDto {
    private String expertName;
    private String profession; // 변호사 / 노무사
    private String specialty; // 전문 분야
    private Double matchScore; // AI 추천도 (0~100)
    private String profileImgUrl;
    private List<String> topReviewTags; // "친절해요", "정확한 분석" 등
}
