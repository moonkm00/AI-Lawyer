package com.ailawyer.backend.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Koyeb 및 외부 모니터링 시스템을 위한 헬스 체크 컨트롤러입니다.
 * SecurityConfig에서 /api/auth/** 경로는 permitAll()로 설정되어 있어 인증 없이 접근 가능합니다.
 */
@RestController
public class HealthController {

    @GetMapping("/api/auth/health")
    public String health() {
        return "OK";
    }
}
