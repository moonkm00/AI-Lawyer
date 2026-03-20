package com.ailawyer.backend.dashboard.service;

import com.ailawyer.backend.dashboard.projection.CategoryLatestRiskProjection;
import com.ailawyer.backend.dashboard.repository.RiskClauseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskClauseService {
    private final RiskClauseRepository riskClauseRepository;

    public List<CategoryLatestRiskProjection> getLatestRisks(Long categoryId) {
        return riskClauseRepository.findLatestRisksByCategoryId(categoryId);
    }
}
