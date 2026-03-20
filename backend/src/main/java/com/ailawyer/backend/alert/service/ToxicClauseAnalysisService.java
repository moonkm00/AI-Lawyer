package com.ailawyer.backend.alert.service;

import com.ailawyer.backend.alert.entity.ContractDocument;
import com.ailawyer.backend.alert.entity.ToxicClauseAlert;
import com.ailawyer.backend.alert.repository.ContractDocumentRepository;
import com.ailawyer.backend.alert.repository.ToxicClauseAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ToxicClauseAnalysisService {

    private final ContractDocumentRepository contractRepository;
    private final ToxicClauseAlertRepository alertRepository;

    @Transactional
    public ContractDocument analyzeContract(String title, String documentType, String documentText) {
        
        // 1. 문서 메타데이터 저장
        ContractDocument contract = ContractDocument.builder()
                .title(title)
                .documentType(documentType)
                .uploadDate(LocalDateTime.now())
                .build();
        contractRepository.save(contract);
        
        // --- 🤖 AI 분석 모의(Mocking) 구간 ---
        // (실제로는 LangChain이나 Gemini API 등을 호출하여 documentText를 통째로 넘기고 배열 형태로 JSON을 받아옴)
        
        if (documentType.contains("용역") || documentType.contains("프리랜서")) {
            ToxicClauseAlert alert1 = ToxicClauseAlert.builder()
                .contract(contract)
                .originalClause("제 7조 (손해배상): 본 계약을 해지하는 경우, '을'은 '갑'에게 지급된 총 계약금의 3배를 위약금으로 즉시 배상해야 한다.")
                .realWorldProblem("🚨 과도한 위약금 폭탄: 이 조항이 유지될 경우, 개인 사정이나 건강 악화로 용역을 중도 포기하게 되면, 본인이 받은 돈의 3배를 물어내야 해서 파산 위기에 처할 수 있습니다. 노동의 대가 이상을 갈취당할 수 있는 최악의 독소조항입니다.")
                .recommendedAction("💡 대안: 위약금 상한선을 통상적 수준인 10% 이내로 제한하고, '정당한 사유가 있을 경우 위약금을 면제한다'는 단서 조항을 요청해야 합니다.")
                .severity(ToxicClauseAlert.Severity.CRITICAL)
                .build();
                
            ToxicClauseAlert alert2 = ToxicClauseAlert.builder()
                .contract(contract)
                .originalClause("제 4조 (저작권 귀속): '을'이 결과물을 '갑'에게 인도한 순간부터, 본 용역 외에서 과거에 개발된 모든 산출물에 대한 지적재산권도 '갑'에게 무상으로 귀속된다.")
                .realWorldProblem("⚠️ 저작권 무단 탈취: 이 용역을 위해 작성한 결과물뿐만 아니라, 당신이 과거에 개인적으로 만들었던 포트폴리오 코드까지 전부 상대방 소유로 넘어갑니다. 훗날 다른 외주를 할 때 '왜 내 코드를 훔쳐 쓰느냐'며 소송당할 수 있습니다.")
                .recommendedAction("💡 대안: '본 용역 기간 중 갑의 비용으로 개발된 결과물만 귀속된다'로 한정하고, 라이브러리 및 기존 솔루션에 대해서는 사용권만 부여하는 것으로 수정하세요.")
                .severity(ToxicClauseAlert.Severity.HIGH)
                .build();

            contract.getToxicClauses().add(alert1);
            contract.getToxicClauses().add(alert2);
        } else {
             ToxicClauseAlert alert = ToxicClauseAlert.builder()
                .contract(contract)
                .originalClause("제 10조 (관할 법원): 본 계약의 분쟁이 발생 시, 관할 법원은 절대적으로 '갑'의 본점 소재지로 한다.")
                .realWorldProblem("😓 소송 진행의 어려움: 만약 지방에 거주하고 계신데 갑의 본사가 제주도라면, 돈을 못 받아 소송을 걸더라도 매번 재판마다 제주도로 이동해야 하므로 사실상 소송을 포기하게 만드는 조항입니다.")
                .recommendedAction("💡 대안: '양 당사자의 합의된 관할법원' 혹은 민사소송법에 따라 피고의 소재지나 원고(내) 주소지로 수정할 수 있도록 협상해보세요.")
                .severity(ToxicClauseAlert.Severity.MEDIUM)
                .build();
             contract.getToxicClauses().add(alert);
        }

        // 계약에 알림 항목들을 묶어서 같이 DB에 반영
        return contractRepository.save(contract);
    }
    
    public List<ContractDocument> getAllDocuments() {
        return contractRepository.findAll();
    }
    
    public ContractDocument getDocumentWithAlerts(Long contractId) {
        return contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문서를 찾을 수 없습니다."));
    }
}
