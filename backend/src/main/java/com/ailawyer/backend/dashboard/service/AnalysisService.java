package com.ailawyer.backend.dashboard.service;

import com.ailawyer.backend.dashboard.dto.AnalysisItemDto;
import com.ailawyer.backend.dashboard.dto.AnalysisRequestDto;
import com.ailawyer.backend.dashboard.entity.AnalysisReportEntity;
import com.ailawyer.backend.dashboard.entity.CategoryEntity;
import com.ailawyer.backend.dashboard.entity.ContractsEntity;
import com.ailawyer.backend.dashboard.entity.RiskClauseEntity;
import com.ailawyer.backend.dashboard.repository.AnalysisReportRepository;
import com.ailawyer.backend.dashboard.repository.CategoryRepository;
import com.ailawyer.backend.dashboard.repository.ContractRepository;
import com.ailawyer.backend.dashboard.repository.RiskClauseRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final CategoryRepository categoryRepository;
    private final ContractRepository contractRepository;
    private final AnalysisReportRepository analysisReportRepository;
    private final RiskClauseRepository riskClauseRepository;

    @Transactional
    public void saveAnalysisResult(AnalysisRequestDto dto) {

        // 1. category 조회 (DB에 존재하는 값만 사용)
        String docType = dto.getResult().getDocumentType();
        CategoryEntity category = categoryRepository.findByCategoryName(docType)
                .or(() -> categoryRepository.findByCategoryName("소비자/기타"))
                .orElseGet(() -> categoryRepository.findAll().stream().findFirst().orElse(null));

        // 2. contract 저장 → contract_id 발급
        ContractsEntity contract = contractRepository.save(
                ContractsEntity.builder()
                        .createdAt(OffsetDateTime.parse(dto.getTimestamp()))
                        .imgUrl(dto.getFileName())
                        .category(category)
                        .userId(1L)
                        .build()
        );

        // 3. analysis_report 저장
        analysisReportRepository.save(
                AnalysisReportEntity.builder()
                        .contract(contract)
                        .score(dto.getResult().getRiskScore())
                        .penaltyScore(dto.getResult().getDisadvantagePercentage())
                        .build()
        );

        // 4. risk_clause 저장 (여러 개)
        for (AnalysisItemDto item : dto.getResult().getAnalysisItems()) {
            riskClauseRepository.save(
                    RiskClauseEntity.builder()
                            .contractId(contract.getContractId())
                            .riskTitle(item.getRiskTitle())
                            .legalBase(item.getLegalBase())
                            .build()
            );
        }
    }
}
