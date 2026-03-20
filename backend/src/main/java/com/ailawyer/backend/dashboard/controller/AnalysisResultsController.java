package com.ailawyer.backend.dashboard.controller;

import com.ailawyer.backend.dashboard.dto.AnalysisRequestDto;
import com.ailawyer.backend.dashboard.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis-results")
@RequiredArgsConstructor
public class AnalysisResultsController {

    private final AnalysisService service;

    @PostMapping
    public ResponseEntity<Void> saveAnalysisResult(@RequestBody AnalysisRequestDto dto) {
        service.saveAnalysisResult(dto);
        return ResponseEntity.ok().build();
    }
}
