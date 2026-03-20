"use client";

import { useState } from "react";

interface ToxicClauseAlert {
  id: number;
  originalClause: string;
  realWorldProblem: string;
  recommendedAction: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
}

interface ContractDocument {
  id: number;
  title: string;
  documentType: string;
  uploadDate: string;
  toxicClauses: ToxicClauseAlert[];
}

export default function AnalysisPage() {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("프리랜서 외주 계약서");
  const [contractText, setContractText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ContractDocument | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !contractText) return alert("계약서 제목과 내용을 입력해주세요.");

    setAnalyzing(true);
    setResult(null);

    try {
      // 스프링 부트에 AI 분석 요청 전송
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/analysis/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          documentType: docType,
          documentText: contractText,
        }),
      });

      if (res.ok) {
        const data: ContractDocument = await res.json();
        setResult(data);
      }
    } catch (error) {
      console.error("분석 중 에러:", error);
      alert("분석 서버와 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요.");
    } finally {
      setAnalyzing(false);
    }
  };

  const severityBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">치명적 독소조항</span>;
      case "HIGH":
        return <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">위험 조항</span>;
      default:
        return <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">주의 조항</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 w-full lg:max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <header className="mb-10 text-center space-y-3 pt-8">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">AI 계약서 독소조항 스캐너</h1>
        <p className="text-slate-500 text-lg">계약 전 반드시 위험을 확인하세요. 독소조항이 가져오는 <strong className="text-rose-600 bg-rose-50 px-1">실제 문제점</strong>을 시뮬레이션 해드립니다.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Upload & Input Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 sticky top-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📄</span> 계약서 등록
            </h2>
            
            <form onSubmit={handleAnalyze} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">계약서 제목</label>
                <input
                  type="text"
                  placeholder="예: IT 개발 용역 계약서 v1"
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-slate-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">계약 유형</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option>프리랜서 외주 계약서</option>
                  <option>근로 계약서</option>
                  <option>동업 계약서</option>
                  <option>기타 계약서 (일반)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">계약서 조항 원문 (가안)</label>
                <textarea
                  placeholder="독소조항이 의심되는 계약서의 텍스트를 이곳에 복사해서 붙여넣으세요..."
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all h-64 resize-none placeholder-slate-400 leading-relaxed"
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full mt-4 bg-slate-800 hover:bg-black text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <span className="animate-spin text-xl">🚀</span> 법률 AI가 위험도를 분석하고 있습니다...
                  </>
                ) : (
                  <>
                    <span className="text-xl">🔍</span> 즉시 독소조항 스캔하기
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Analysis Report (Implications Comparison) */}
        <div className="lg:col-span-7">
          {!result && !analyzing && (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 p-12 text-center">
              <span className="text-6xl mb-4 block mix-blend-luminosity opacity-40">🤖</span>
              <h3 className="text-xl font-bold text-slate-500 mb-2">분석 대기 중</h3>
              <p className="text-sm">좌측 폼에 계약서 내용을 입력하고 스캔을 누르시면, 숨겨진 함정을 파악해드립니다.</p>
            </div>
          )}

          {analyzing && (
            <div className="h-full min-h-[500px] bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center p-12">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 animate-pulse">조항의 문맥을 분석 중입니다...</h3>
              <ul className="text-slate-500 space-y-2 text-sm text-center">
                <li>• 은유적으로 작성된 불리한 조건 탐색 중</li>
                <li>• 표준 권고안 대비 책임 한도 위반 여부 확인</li>
                <li>• 과거 판례에 근거한 피해 발생 시나리오 작성 중</li>
              </ul>
            </div>
          )}

          {result && !analyzing && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              <div className="bg-slate-900 border-b border-slate-800 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
                <h2 className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  AI Analysis Report
                </h2>
                <h3 className="text-3xl font-bold mb-4">"{result.title}" 분석 결과</h3>
                <div className="flex gap-4">
                  <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm border border-slate-700 text-slate-300">
                    분석일: {new Date(result.uploadDate).toLocaleDateString()}
                  </span>
                  <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm border border-slate-700 text-slate-300">
                    발견된 독소조항: <strong className="text-rose-400 text-base">{result.toxicClauses.length}</strong>개
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-8 bg-slate-50">
                {result.toxicClauses.length === 0 ? (
                  <div className="text-center p-10 bg-green-50 border border-green-200 rounded-2xl">
                    <span className="text-4xl mb-3 block">🎉</span>
                    <h4 className="text-lg font-bold text-green-800">이 계약서는 안전해 보입니다.</h4>
                    <p className="text-green-600 mt-1">하지만 AI가 보장하는 것은 아니므로 중요 사항은 재확인하세요.</p>
                  </div>
                ) : (
                  result.toxicClauses.map((clause, index) => (
                    <div key={clause.id} className="bg-white border hover:border-blue-300 hover:shadow-lg transition-all rounded-3xl overflow-hidden flex flex-col group">
                      
                      {/* Original Clause Header */}
                      <div className="p-6 border-b border-slate-100 bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <span className="flex items-center gap-2 text-slate-400 font-bold">
                            <span className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center font-black">
                              {index + 1}
                            </span>
                          </span>
                          {severityBadge(clause.severity)}
                        </div>
                        <h4 className="text-xs font-bold text-slate-400 mb-2 tracking-wide uppercase">계약서 원문</h4>
                        <p className="text-slate-800 font-medium leading-relaxed font-serif bg-slate-50 p-4 rounded-xl border-l-4 border-slate-300">
                          {clause.originalClause}
                        </p>
                      </div>

                      {/* AI Implication Breakdown */}
                      <div className="p-6 bg-gradient-to-br from-rose-50/50 to-white relative">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-rose-200">🚩</span>
                        </div>
                        <h4 className="flex items-center gap-2 text-rose-700 font-black text-lg mb-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                          그대로 승낙했을 때 발생하는 "실제 문제점"
                        </h4>
                        <div className="bg-white border border-rose-100 rounded-xl p-5 shadow-sm">
                          <p className="text-slate-700 leading-relaxed">
                            {clause.realWorldProblem}
                          </p>
                        </div>
                      </div>

                      {/* Recommended Action */}
                      <div className="p-6 bg-blue-50/50 border-t border-slate-100 mt-auto">
                        <h4 className="text-blue-800 font-bold text-sm mb-3">💡 협상 솔루션 및 표준 대안</h4>
                        <p className="text-blue-900 bg-white border border-blue-100 p-4 rounded-xl shadow-sm text-sm leading-relaxed">
                          {clause.recommendedAction}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
