package com.ailawyer.backend.alert.service;

import com.ailawyer.backend.alert.entity.BlacklistKeyword;
import com.ailawyer.backend.alert.entity.ContractDocument;
import com.ailawyer.backend.alert.repository.BlacklistKeywordRepository;
import com.ailawyer.backend.alert.repository.ContractDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyInsightsService {

    private final ContractDocumentRepository contractRepository;
    private final BlacklistKeywordRepository keywordRepository;

    // 1. 커스텀 블랙리스트 키워드 등록/조회 로직
    @Transactional
    public BlacklistKeyword addKeyword(String keyword, String warningMessage, String severity) {
        if (keywordRepository.findByKeyword(keyword).isPresent()) {
             throw new IllegalArgumentException("이미 등록된 키워드입니다.");
        }
        return keywordRepository.save(BlacklistKeyword.builder()
                .keyword(keyword)
                .warningMessage(warningMessage)
                .severity(severity)
                .build());
    }

    public List<BlacklistKeyword> getAllKeywords() {
        return keywordRepository.findAll();
    }

    // 2. 계약서 원문을 받아 커스텀 블랙리스트 키워드가 포함되어 있는지 검사 (사전 경고용)
    public List<Map<String, String>> scanForBlacklistKeywords(String documentText) {
        List<Map<String, String>> detected = new ArrayList<>();
        List<BlacklistKeyword> allKeywords = keywordRepository.findAll();

        for (BlacklistKeyword bk : allKeywords) {
            if (documentText.contains(bk.getKeyword())) {
                Map<String, String> alertMap = new HashMap<>();
                alertMap.put("keyword", bk.getKeyword());
                alertMap.put("warningMessage", bk.getWarningMessage());
                alertMap.put("severity", bk.getSeverity());
                detected.add(alertMap);
            }
        }
        return detected;
    }

    // 3. 전수조사 및 통계 (전체 계약서 대비 독소조항 포함 계약의 비율 등 시각화 데이터 계산)
    public Map<String, Object> getCompanyContractStatistics() {
        List<ContractDocument> allContracts = contractRepository.findAll();
        long totalCount = allContracts.size();
        long toxicContractsCount = allContracts.stream()
                .filter(c -> !c.getToxicClauses().isEmpty())
                .count();

        // 모의 데이터 (실제로 DB가 비어있으면 데모 화면을 위해 임의 구성)
        if (totalCount == 0) {
            totalCount = 120;
            toxicContractsCount = 35;
        }

        double toxicRatio = (double) toxicContractsCount / totalCount * 100.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalContracts", totalCount);
        stats.put("toxicContractsCount", toxicContractsCount);
        stats.put("toxicRatio", Math.round(toxicRatio * 10) / 10.0);
        
        // 부서별 혹은 유형별 독소조항 비율 (Mock Data)
        stats.put("toxicByDepartment", Map.of(
            "프리랜서 외주", 45,
            "근로계약", 20,
            "동업/투자", 30,
            "기타 상거래", 5
        ));

        return stats;
    }
}
