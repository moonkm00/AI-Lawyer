"use client";

import { useEffect, useState } from "react";

interface ContractCondition {
  id: number;
  contractName: string;
  triggerCondition: string;
  deadlineDate: string;
  actionRequired: string;
  status: "PENDING" | "NOTIFIED" | "COMPLETED";
}

export default function MonitoringGuardianPage() {
  const [conditions, setConditions] = useState<ContractCondition[]>([]);
  const [loading, setLoading] = useState(true);

  // 폼 상태
  const [contractName, setContractName] = useState("");
  const [triggerCondition, setTriggerCondition] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [actionRequired, setActionRequired] = useState("");

  const fetchConditions = async () => {
    try {
      // 스프링 부트 백엔드 엔드포인트 호출
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/monitoring`);
      if (res.ok) {
        const data = await res.json();
        setConditions(data);
      }
    } catch (error) {
      console.error("조건을 불러오는 데 실패했습니다", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConditions();
  }, []);

  const handleAddCondition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/monitoring`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractName,
          triggerCondition,
          deadlineDate,
          actionRequired,
        }),
      });
      if (res.ok) {
        // 입력 초기화 및 리스트 갱신
        setContractName("");
        setTriggerCondition("");
        setDeadlineDate("");
        setActionRequired("");
        fetchConditions();
        alert("계약 조건이 성공적으로 추가되었습니다.");
      }
    } catch (error) {
      console.error("추가 실패:", error);
      alert("조건 추가에 실패했습니다.");
    }
  };

  const handleForceCheck = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      await fetch(`${apiUrl}/api/monitoring/run-check-now`, {
        method: "POST",
      });
      alert("가디언 알림 검사가 강제 실행되었습니다. 백엔드 로그를 확인하세요.");
      fetchConditions();
    } catch (error) {
      console.error("강제 검사 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <span className="text-blue-600 bg-blue-100 p-2 rounded-lg">🛡️</span>
            실시간 계약 모니터링 가디언
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">AI가 기억하여 사전 알림을 주는 사후 관리 시스템입니다.</p>
        </div>
        <button
          onClick={handleForceCheck}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <span>⚡</span> 즉시 검사 실행 (Test)
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 border-t-4 border-t-blue-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>➕</span> 조건 수동 등록
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleAddCondition}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">계약명</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm transition-all"
                placeholder="예: 프리랜서 용역 계약서"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">조건 발동 상황</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm transition-all"
                placeholder="예: 납기 5일 전"
                value={triggerCondition}
                onChange={(e) => setTriggerCondition(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">마감 기한 (Deadline)</label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm transition-all"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">알림 내용 및 위약금 등</label>
              <textarea
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-sm transition-all h-24 resize-none"
                placeholder="예: 제7조항에 따라 미준수 시 계약금 30% 위약금 발생 주의!"
                value={actionRequired}
                onChange={(e) => setActionRequired(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-2 rounded-xl transition-all shadow-md active:scale-95"
            >
              조건 저장하기
            </button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 relative">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📋</span> 등록된 알림 및 계약 조건 목록
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center p-12 text-gray-500">
              <span className="animate-spin text-3xl mr-3">⚙️</span>
              불러오는 중...
            </div>
          ) : conditions.length === 0 ? (
            <div className="text-center p-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="text-5xl mb-3 block">📭</span>
              <div>아직 등록된 모니터링 조건이 없습니다.</div>
              <div className="text-xs mt-2">좌측에서 새로운 조건을 등록해보세요.</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {conditions.map((cond) => (
                <div
                  key={cond.id}
                  className={`border p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md ${
                    cond.status === "PENDING"
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-200 bg-gray-50 opacity-70"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 space-y-1">
                      <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">
                        {cond.contractName}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${
                          cond.status === "PENDING"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : cond.status === "NOTIFIED"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {cond.status === "PENDING" ? "감시 중 👀" : cond.status === "NOTIFIED" ? "알림 발송됨 ⚠️" : cond.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 font-medium flex gap-2">
                      <span className="bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">기한: {cond.deadlineDate}</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">조건: {cond.triggerCondition}</span>
                    </div>
                    <p className="text-rose-600 font-semibold text-sm mt-3 bg-rose-50 p-2.5 rounded border border-rose-100">
                      🚨 알림내용: {cond.actionRequired}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
