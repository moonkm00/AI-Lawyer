"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  FileUp, 
  ArrowRightLeft, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  RefreshCcw,
  Scale,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";

interface ContractInfo {
  contractId: number;
  fileName: string;
  imgUrl: string;
  pros: string[];
  cons: string[];
  overallScore: number;
}

interface ComparisonResult {
  contractA: ContractInfo;
  contractB: ContractInfo;
  recommendation: string;
  needsExpert: boolean;
}

export default function ComparePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fileInputARef = useRef<HTMLInputElement>(null);
  const fileInputBRef = useRef<HTMLInputElement>(null);

  const handleFileASelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFileA(e.target.files[0]);
  };

  const handleFileBSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFileB(e.target.files[0]);
  };

  const handleCompare = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!fileA || !fileB) {
      setError("두 개의 파일을 모두 업로드해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("fileA", fileA);
    formData.append("fileB", fileB);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/reports/compare`, {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "비교 분석 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setFileA(null);
    setFileB(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-10 max-w-[400px] w-full shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1E1B4B]">로그인이 필요합니다</h3>
              <p className="text-slate-500 font-medium">정밀 비교 분석 서비스는 사용자분들의 <br/> 안전한 회원 정보가 꼭 필요합니다.</p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => router.push("/login")}
                className="w-full py-4 bg-[#1E1B4B] text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:-translate-y-1 transition-all"
              >
                로그인하러 가기
              </button>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                나중에 하기
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-16">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-[11px] font-black uppercase tracking-widest">
            <Scale className="w-3 h-3" /> A/B Comparison Engine
          </div>
          <h1 className="text-5xl font-black text-[#1E1B4B] tracking-tight">
            어떤 계약서가 <span className="text-indigo-600">더 유리할까요?</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            두 개의 계약서를 업로드하여 독소조항과 리스크를 즉시 비교하고 최적의 선택안을 확인하세요.
          </p>
        </header>

        {!result ? (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
              {/* Slot A */}
              <div 
                onClick={() => fileInputARef.current?.click()}
                className={`bg-white rounded-[32px] p-8 border-2 border-dashed transition-all cursor-pointer group hover:bg-slate-50 ${fileA ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-200'}`}
              >
                <div className="flex flex-col items-center text-center py-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${fileA ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <FileUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">
                    {fileA ? fileA.name : "계약서 A 업로드"}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">비교할 첫 번째 문서를 올려주세요</p>
                  <input ref={fileInputARef} type="file" className="hidden" onChange={handleFileASelect} accept=".pdf,.png,.jpg,.jpeg" />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-300 border border-slate-100">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
              </div>

              {/* Slot B */}
              <div 
                onClick={() => fileInputBRef.current?.click()}
                className={`bg-white rounded-[32px] p-8 border-2 border-dashed transition-all cursor-pointer group hover:bg-slate-50 ${fileB ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-200'}`}
              >
                <div className="flex flex-col items-center text-center py-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${fileB ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <FileUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">
                    {fileB ? fileB.name : "계약서 B 업로드"}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">대조할 두 번째 문서를 올려주세요</p>
                  <input ref={fileInputBRef} type="file" className="hidden" onChange={handleFileBSelect} accept=".pdf,.png,.jpg,.jpeg" />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <button
                onClick={handleCompare}
                disabled={loading || !fileA || !fileB}
                className="px-12 py-5 bg-[#1E1B4B] text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 hover:shadow-indigo-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
              >
                {loading ? (
                  <RefreshCcw className="w-6 h-6 animate-spin" />
                ) : (
                  <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400" />
                )}
                {loading ? "분석 리포트 생성 중..." : "두 계약서 비교 분석하기"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Recommendation Header */}
            <div className="bg-[#1E1B4B] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                    AI Final Judgment
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black leading-tight">
                    {result.recommendation}
                  </h2>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white/10 rounded-[32px] backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <ShieldCheck className="w-12 h-12 text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contract A */}
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase">Contract A</span>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">안전 스코어</p>
                      <p className="text-3xl font-black text-indigo-600">{result.contractA.overallScore}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 truncate">{result.contractA.fileName}</h3>
                </div>
                
                <div className="p-8 space-y-8 flex-1">
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" /> 긍정적 측면 (Pros)
                    </h4>
                    <div className="space-y-3">
                      {result.contractA.pros.map((pro, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                          <span className="text-emerald-400 flex-shrink-0">•</span>
                          {pro}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" /> 주의/리스크 측면 (Cons)
                    </h4>
                    <div className="space-y-3">
                      {result.contractA.cons.map((con, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                          <span className="text-rose-400 flex-shrink-0">🚩</span>
                          {con}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract B */}
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase">Contract B</span>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">안전 스코어</p>
                      <p className="text-3xl font-black text-violet-600">{result.contractB.overallScore}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 truncate">{result.contractB.fileName}</h3>
                </div>
                
                <div className="p-8 space-y-8 flex-1">
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" /> 긍정적 측면 (Pros)
                    </h4>
                    <div className="space-y-3">
                      {result.contractB.pros.map((pro, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                          <span className="text-emerald-400 flex-shrink-0">•</span>
                          {pro}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" /> 주의/리스크 측면 (Cons)
                    </h4>
                    <div className="space-y-3">
                      {result.contractB.cons.map((con, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                          <span className="text-rose-400 flex-shrink-0">🚩</span>
                          {con}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 전문가 매칭 기능 - 추후 개발 사항으로 주석 처리
            {result.needsExpert && (
              <div className="p-8 bg-amber-50 rounded-[32px] border border-amber-200 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-lg font-black text-amber-900 mb-1">전문가 검토가 강력히 권장됩니다.</h4>
                  <p className="text-amber-700 font-medium">두 계약서 모두 리스크 점수가 높거나 중대한 독소조항이 발견되었습니다. 서명 전 변호사 자문을 받으세요.</p>
                </div>
                <button className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-black hover:bg-amber-700 transition shadow-lg shadow-amber-200 flex items-center gap-2">
                  전문가 매칭하기 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
            */}

            <div className="flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={resetComparison}
                className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-lg hover:border-indigo-100 hover:text-indigo-600 transition-all flex items-center justify-center gap-3"
              >
                <RefreshCcw className="w-5 h-5" /> 다시 분석하기
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
