"use client";

import { useEffect, useState } from "react";

export default function CompanyInsightsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [blacklist, setBlacklist] = useState<any[]>([]);

  // 폼 변수
  const [newKeyword, setNewKeyword] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [severity, setSeverity] = useState("CRITICAL");

  // 모의 테스트용 계약서 변수
  const [testDocumentText, setTestDocumentText] = useState("");
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    fetchStats();
    fetchBlacklist();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/insights/stats`);
      setStats(await res.json());
    } catch (e) { console.error("통계 로드 오류", e); }
  };

  const fetchBlacklist = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/insights/blacklist-keywords`);
      setBlacklist(await res.json());
    } catch (e) { console.error("블랙리스트 로드 오류", e); }
  };

  // 블랙리스트 키워드 추가
  const addKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      await fetch(`${apiUrl}/api/insights/blacklist-keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: newKeyword, warningMessage, severity })
      });
      setNewKeyword(""); setWarningMessage("");
      fetchBlacklist();
    } catch (e) { alert("키워드 중복이거나 서버 오류입니다."); }
  };

  // 계약서 본문으로 블랙리스트 키워드 스캔 테스트
  const scanDocument = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/insights/scan-blacklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: testDocumentText })
      });
      setTestResult(await res.json());
    } catch (e) { console.error("스캔 실패", e); }
  };

  // 갱신 시점 도래 조건 알림 Mock 발송 테스트
  const triggerRenewalNotification = async () => {
    // 1. JSON Data 얻어오기 
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${apiUrl}/api/insights/renewal-mock-trigger`);
    const jsonPayload = await res.json();
    
    // 2. 알림 센터 (Notification DB) 로 쏘기
    await fetch(`${apiUrl}/api/notifications/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonPayload)
    });

    alert("갱신/종료 조건변경 필요 알림이 통합 알림 센터(Notification JSON) 서버로 성공적으로 전송되었습니다!\n\n/notifications 메뉴에서 확인하세요.");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI 경영 리스크 대시보드</h1>
        <p className="text-slate-500 mt-2">전사 계약서 통계 조회 & 커스텀 독소 키워드 관제 시스템</p>
      </header>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 첫 번째 줄: 전수조사 및 통계 */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span>📊</span> 전사 계약서 전수조사 및 통계</h2>
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">체결된 전체 계약서</p>
                <p className="text-4xl font-black text-slate-800">{stats.totalContracts}건</p>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                <p className="text-sm font-semibold text-rose-500 uppercase tracking-widest mb-1">독소조항 포함 계약 건수</p>
                <p className="text-4xl font-black text-rose-700">{stats.toxicContractsCount}건</p>
                <p className="text-xs text-rose-500 font-medium mt-2">재협상 강력 권고 대상</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col justify-center items-center text-center relative overflow-hidden">
                <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-1 z-10">위험 계약 비율</p>
                <p className="text-5xl font-black text-blue-700 z-10">{stats.toxicRatio}%</p>
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl"></div>
              </div>
            </div>
          ) : <p className="text-slate-400">통계 데이터를 불러오는 중...</p>}
        </section>

        {/* 두 번째 줄: 블랙리스트 키워드 기능 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 2-1 담당자 경고 세팅 */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 border-t-8 border-t-slate-800">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span>🚫</span> 사내 블랙리스트 키워드 관리</h2>
             <p className="text-sm text-slate-500 mb-6 font-medium">우리 회사에 절대 체결되어선 안될 필수 필터 키워드를 등록하세요.</p>
             
             <form onSubmit={addKeyword} className="space-y-4 mb-8">
               <input 
                 className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:ring-2 focus:ring-slate-800 outline-none" 
                 placeholder="예: 지식재산권 전부 양도" 
                 required value={newKeyword} onChange={e => setNewKeyword(e.target.value)} 
               />
               <input 
                 className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:ring-2 focus:ring-slate-800 outline-none" 
                 placeholder="법무팀 경고 문구 (예: 원천기술이 탈취될 수 있습니다.)" 
                 required value={warningMessage} onChange={e => setWarningMessage(e.target.value)} 
               />
               <div className="flex gap-4 items-center">
                 <select 
                   className="border border-slate-200 p-3 rounded-xl bg-slate-50 flex-1 outline-none"
                   value={severity} onChange={e => setSeverity(e.target.value)}
                 >
                   <option value="CRITICAL">치명적 (CRITICAL)</option>
                   <option value="HIGH">위험 (HIGH)</option>
                 </select>
                 <button className="bg-slate-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition flex-shrink-0">
                   등록
                 </button>
               </div>
             </form>

             <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {blacklist.length === 0 && <p className="text-sm text-slate-400 text-center py-4">등록된 커스텀 키워드가 없습니다.</p>}
                {blacklist.map((b, i) => (
                   <div key={i} className="border border-red-100 bg-red-50/30 p-4 rounded-xl flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-slate-800 mb-1">"{b.keyword}" <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded ml-2">{b.severity}</span></div>
                        <div className="text-sm text-slate-600 font-medium">💡 {b.warningMessage}</div>
                      </div>
                   </div>
                ))}
             </div>
          </section>

          {/* 2-2 계약 체결 전 스캔 시뮬레이션 및 갱신 JSON 발송 */}
          <div className="space-y-10">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><span className="text-6xl">🤖</span></div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900 z-10 relative"><span>🔍</span> 블랙리스트 검사원 (JSON 테스트)</h2>
                <textarea 
                  className="w-full border border-slate-200 p-4 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none mb-3 font-serif" 
                  placeholder="계약서의 문장을 넣어보세요. (예: 개발된 지식재산권 전부 양도를 조건으로 한다.)"
                  value={testDocumentText} onChange={e => setTestDocumentText(e.target.value)}
                />
                <button onClick={scanDocument} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition" >스캔 및 차단 검사 (JSON)</button>

                {testResult && (
                  <div className={`mt-6 p-5 rounded-xl border ${testResult.status === 'SAFE' ? 'bg-green-50 border-green-200' : 'bg-rose-50 border-rose-200'}`}>
                    <div className="font-bold mb-2 break-words">JSON 응답 상태: {testResult.status}</div>
                    {testResult.detectedKeywords?.map((d:any, idx:number) => (
                      <div key={idx} className="bg-white p-3 rounded border border-rose-100 text-sm mt-2 text-rose-800 font-bold">
                        발견된 치명적 키워드: "{d.keyword}" <br/>
                        <span className="font-normal text-rose-600 mt-1 block">- {d.warningMessage}</span>
                      </div>
                    ))}
                    {testResult.status === 'SAFE' && <div className="text-green-700 font-bold">블랙리스트에 해당되는 문장이 없습니다.</div>}
                  </div>
                )}
            </section>

            <section className="bg-indigo-900 p-8 rounded-3xl shadow-lg border border-indigo-700 text-white flex flex-col items-center text-center">
                <div className="text-4xl mb-4 animate-bounce">⏰</div>
                <h2 className="text-xl font-bold mb-2">계약 갱신 전 독소조항 조건 변경 (스케줄러 Mock)</h2>
                <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                  독소조항이 껴있는 채로 울며 겨자 먹기로 맺었던 계약... 갱신 시기(종료 1개월 전)가 도래하면 
                  "조건 변경 검토 요망" 이라는 JSON 알림을 담당자에게 뿌립니다.
                </p>
                <button 
                  onClick={triggerRenewalNotification} 
                  className="bg-indigo-500 text-white w-full font-bold py-3.5 rounded-xl hover:bg-indigo-400 transition"
                >
                  갱신/변경 알림 JSON 쏘기
                </button>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
