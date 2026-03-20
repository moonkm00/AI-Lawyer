package com.ailawyer.backend.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * [CORE] 세션별 분석 컨텍스트 관리자
 * 사용자의 분석 결과(JSON)를 메모리에 임시 보관하여 챗봇이 이를 기반으로 답변(RAG)할 수 있게 합니다.
 */
@Slf4j
@Component
public class AnalysisContextManager {

    // 실제 서비스에서는 Redis나 DB를 사용하지만, 현재는 기능 검증을 위해 메모리 맵을 사용합니다.
    // Key: 고유 식별자 (현재는 단일 사용자 테스트를 위해 "shared-context" 사용)
    private final Map<String, String> analysisContexts = new ConcurrentHashMap<>();

    /**
     * 분석 결과를 컨텍스트에 저장합니다.
     */
    public void saveContext(String key, String analysisJson) {
        log.info("컨텍스트 저장: {}", key);
        analysisContexts.put(key, analysisJson);
    }

    /**
     * 저장된 분석 결과를 가져옵니다.
     */
    public String getContext(String key) {
        return analysisContexts.getOrDefault(key, "이전에 분석된 계약서 내용이 없습니다. 먼저 계약서를 업로드해 주세요.");
    }

    /**
     * 컨텍스트를 초기화합니다.
     */
    public void clearContext(String key) {
        analysisContexts.remove(key);
    }
}
