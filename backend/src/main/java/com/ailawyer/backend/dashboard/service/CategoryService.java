package com.ailawyer.backend.dashboard.service;

import com.ailawyer.backend.dashboard.projection.CategoryScoreProjection;
import com.ailawyer.backend.dashboard.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repository;
    
    // 카테고리 id별 계약서 수
    public Long getContractCountByCategoryId(Long categoryId) {
        return repository.countContractsByCategoryId(categoryId);
    }

    public CategoryScoreProjection getFindAvgScoreByCategoryId(Long categoryId) {
        return repository.findAvgScoreByCategoryId(categoryId);
    }

    public Long getContractCount(Long categoryId) {
        return repository.countContractsByCategoryId(categoryId);
    }
}
