package com.ailawyer.backend.dashboard.repository;

import com.ailawyer.backend.dashboard.entity.RiskClauseEntity;
import com.ailawyer.backend.dashboard.projection.CategoryLatestRiskProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RiskClauseRepository extends JpaRepository<RiskClauseEntity, Long> {
    
    @Query(value = """
        SELECT r.risk_title AS riskTitle, 
               r.legal_base AS legalBase 
        FROM \"Risk_Clause\" r 
        JOIN \"Contracts\" c ON r.contract_id = c.contract_id 
        WHERE c.category_id = :categoryId 
        ORDER BY r.risk_clause_id DESC 
        LIMIT 3
    """, nativeQuery = true)
    List<CategoryLatestRiskProjection> findLatestRisksByCategoryId(@Param("categoryId") Long categoryId);
}
