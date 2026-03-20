package com.ailawyer.backend.alert.controller;

import com.ailawyer.backend.alert.entity.ContractDocument;
import com.ailawyer.backend.alert.service.ToxicClauseAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ToxicClauseAnalysisController {

    private final ToxicClauseAnalysisService service;

    public record AnalyzeRequest(
            String title,
            String documentType,
            String documentText
    ) {}

    @PostMapping("/run")
    public ResponseEntity<ContractDocument> runAnalysis(@RequestBody AnalyzeRequest req) {
        ContractDocument analyzedDocument = service.analyzeContract(
                req.title(),
                req.documentType(),
                req.documentText()
        );
        return ResponseEntity.ok(analyzedDocument);
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<ContractDocument>> getHistory() {
        return ResponseEntity.ok(service.getAllDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractDocument> getDocumentDetails(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDocumentWithAlerts(id));
    }
}
