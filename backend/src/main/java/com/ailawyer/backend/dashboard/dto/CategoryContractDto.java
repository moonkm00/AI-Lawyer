package com.ailawyer.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
// 카테고리별로 계약서가 몇개인가
public class CategoryContractDto {
    private String categoryName;
    private Long contractCount;
}
