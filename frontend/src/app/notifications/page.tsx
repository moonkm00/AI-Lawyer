"use client";

import { useEffect, useState } from "react";

interface NotificationEvent {
  id: number;
  receiverId: string;
  sourceSystem: string;
  title: string;
  message: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  referenceLink?: string;
  eventTime: string;
  read: boolean;
}

export default function NotificationDashboardPage() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // (예시용 사용자 ID - 실제로는 Auth 컨텍스트나 상태관리에서 가져옴)
  const loggedInUserId = "user_12345";

  const fetchNotis = async () => {
    try {
      // 해당 유저의 모든 알림 리스트 호출
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/notifications/${loggedInUserId}`);
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (error) {
      console.error("알림 동기화 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 최초에 한번 호출 후 3초마다 지속적으로 백엔드를 폴링(Polling) 합니다.
    // ※ 추후 WebSocket이나 SSE(Server-Sent Events)로 변경하면 실시간 푸시 처리가 가능합니다.
    fetchNotis();
    const interval = setInterval(fetchNotis, 3000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      await fetch(`${apiUrl}/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const getStyleBySeverity = (severity: string, isRead: boolean) => {
    if (isRead) return "border-slate-200 bg-slate-50 text-slate-500 opacity-60";
    
    switch (severity) {
      case "CRITICAL":
        return "border-rose-400 bg-rose-50 text-rose-900 shadow-md animate-pulse border-l-8";
      case "HIGH":
        return "border-orange-300 bg-orange-50 text-orange-900 shadow-sm border-l-4";
      case "MEDIUM":
        return "border-amber-300 bg-amber-50 text-amber-900 border-l-4";
      default:
        return "border-blue-200 bg-blue-50 text-blue-900 border-l-4";
    }
  };

  // 모의 테스트용 팀원 JSON 데이터 발송 함수
  const handleSimulateJsonSend = async () => {
    const jsonPayload = {
      receiverId: loggedInUserId,
      sourceSystem: "AI_ANALYSIS_ENGINE",
      title: "🚨 독소조항: 퇴사 후 3년간 동종업계 취업 금지",
      message: "분석된 근로계약서 제8조항이 발견되었습니다. 이 조항을 무시하고 서명할 시 귀하의 추후 취업 및 창업에 심각한 법적 제약이 따르게 됩니다. 관련 판례를 확인하고 즉시 수정안을 제시하세요.",
      severity: "CRITICAL",
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    fetch(`${apiUrl}/api/notifications/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonPayload)
    });
  };

  const handleSimulateBulkJsonSend = async () => {
    const bulkPayload = {
      receiverId: loggedInUserId,
      contractId: "D-1029",
      contractName: "2026년 프리랜서 외주 개발 계약서",
      toxicClauses: [
        { clauseName: "제4조 저작권 무상 양도", severity: "HIGH" },
        { clauseName: "제7조 과도한 손해배상 (3배 위약금)", severity: "CRITICAL" },
        { clauseName: "제10조 관할 법원 (갑의 본점 소재지)", severity: "MEDIUM" }
      ]
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiUrl}/api/notifications/send/bulk-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkPayload)
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex p-8 justify-center antialiased">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white px-8 py-6 rounded-3xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-3">
              <span className="text-3xl">🔔</span> 
              통합 알림 센터 
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-bounce">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </h1>
            <p className="text-slate-400 mt-1 font-medium">AI 시스템, 가동 스케줄러가 보내는 실시간 JSON 알림들입니다.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button 
              onClick={handleSimulateJsonSend}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-semibold py-2.5 px-4 rounded-xl shadow-sm active:scale-95 text-sm"
              title="한 가지 알림을 보냅니다 (A방안)"
            >
              단건 JSON 발송 (방안A)
            </button>
            <button 
              onClick={handleSimulateBulkJsonSend}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 transition-colors text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg active:scale-95 text-sm"
              title="여러 독소조항을 묶어 하나로 요약해 보냅니다 (B방안)"
            >
              <span>✨</span> 다건 통합 JSON 쏘기 (방안B)
            </button>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
          
          {loading ? (
             <div className="flex flex-col items-center justify-center p-20 text-slate-400">
               <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
               <p className="font-semibold">알림 스트림을 동기화하는 중입니다...</p>
             </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-24 text-slate-400 bg-slate-50/50 m-6 border-2 border-dashed border-slate-200 rounded-3xl">
               <span className="text-6xl mb-4 opacity-70">💨</span>
               <h3 className="text-xl font-bold text-slate-500 mb-2">수신된 알림이 없습니다.</h3>
               <p className="text-sm">다른 시스템에서 아직 JSON을 보내지 않았습니다.<br/>우측 상단 '테스트' 버튼을 눌러 모의 발송해 보세요.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((noti) => (
                <div 
                  key={noti.id} 
                  className={`p-6 transition-all duration-300 border-l ${getStyleBySeverity(noti.severity, noti.read)} 
                    ${!noti.read ? 'hover:bg-opacity-80 cursor-pointer' : ''}`}
                  onClick={() => !noti.read && markAsRead(noti.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {!noti.read && <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>}
                        <h3 className={`font-bold text-lg ${noti.read ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>
                          {noti.title}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white border opacity-80 shadow-sm uppercase">
                          {noti.severity}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed mt-1 ${noti.read ? 'text-slate-400' : 'font-medium'}`}>
                        {noti.message}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-xs font-semibold flex-wrap">
                        <span className="text-slate-400 flex items-center gap-1">🕒 {new Date(noti.eventTime).toLocaleString()}</span>
                        <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">From: {noti.sourceSystem}</span>
                        {noti.referenceLink && (
                          <a href={noti.referenceLink} className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 transition-colors">
                            <span>🔍</span> 상세 리포트 확인하기 &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {!noti.read && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); markAsRead(noti.id); }}
                        className="text-slate-400 hover:text-slate-800 hover:bg-slate-200 p-2 rounded-full transition-all flex-shrink-0"
                        title="읽음 처리"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
