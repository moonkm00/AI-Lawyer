package com.ailawyer.backend.dashboard.repository;

import com.ailawyer.backend.dashboard.entity.CategoryEntity;
import com.ailawyer.backend.dashboard.projection.CategoryScoreProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    Optional<CategoryEntity> findByCategoryName(String categoryName);

    @Query(value = "SELECT COUNT(contract_id) FROM \"Contracts\" WHERE category_id = :categoryId", nativeQuery = true)
    Long countContractsByCategoryId(@Param("categoryId") Long categoryId);

    // Native query로 대소문자 문제 해결, CategoryScoreProjection 활용
    @Query(value = """
        SELECT cat.category_name AS categoryName, 
               AVG(r.score) AS avgRiskScore, 
               AVG(r.penalty_score) AS avgDisadvantagePercent 
        FROM \"Category\" cat 
        JOIN \"Contracts\" c ON c.category_id = cat.category_id 
        JOIN \"Analysis_Report\" r ON r.contract_id = c.contract_id 
        WHERE cat.category_id = :categoryId 
        GROUP BY cat.category_id, cat.category_name
    """, nativeQuery = true)
    CategoryScoreProjection findAvgScoreByCategoryId(@Param("categoryId") Long categoryId);
}