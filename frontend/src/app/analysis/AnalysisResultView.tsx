"use client"

import React from "react"
import { 
  X, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  MessageSquare
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AnalysisResultViewProps {
  result: any
  onClose: () => void
  onOpenChat: () => void
}

export function AnalysisResultView({ result, onClose, onOpenChat }: AnalysisResultViewProps) {
  if (!result) return null

  const data = result.result
  const safetyScore = 100 - (data.risk_score || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg shrink-0">
              <FileText className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight truncate">
                {data.document_type || "분석 리포트"}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{result.fileName || "업로드된 문서"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 bg-slate-50/50">
          
          {/* Main Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="sm:col-span-2 p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl sm:rounded-3xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-indigo-100 font-medium mb-1 text-sm">AI 종합 분석 결과</h3>
                 <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                   <h4 className="text-4xl sm:text-5xl font-black">
                     {safetyScore === 100 ? "최우수" : safetyScore >= 80 ? "양호" : "주의"}
                   </h4>
                   <span className="text-indigo-200 font-bold text-sm sm:text-base">등급</span>
                 </div>
                 <p className="text-indigo-50/80 text-xs sm:text-sm leading-relaxed max-w-md">
                   {data.summary}
                 </p>
               </div>
               <ShieldCheck className="absolute -bottom-8 -right-8 w-32 h-32 sm:w-48 sm:h-48 text-white/10" />
            </div>

            <Card className="bg-white border-none shadow-sm rounded-2xl sm:rounded-3xl flex flex-row sm:flex-col items-center justify-between sm:justify-center p-5 sm:p-6 text-center gap-4">
              <h5 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest sm:mb-3">안전 지수</h5>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-16 h-16 sm:w-24 sm:h-24 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 sm:hidden" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 hidden sm:block" />
                  
                  {/* Small Screen Circle */}
                  <circle 
                    cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                    strokeDasharray={175.9}
                    strokeDashoffset={175.9 - (safetyScore / 100) * 175.9}
                    className="text-indigo-600 sm:hidden"
                  />
                  {/* Large Screen Circle */}
                  <circle 
                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (safetyScore / 100) * 251.2}
                    className="text-indigo-600 hidden sm:block"
                  />
                </svg>
                <span className="absolute text-lg sm:text-xl font-black text-slate-800">{safetyScore}</span>
              </div>
            </Card>

            <Card className="bg-white border-none shadow-sm rounded-2xl sm:rounded-3xl flex flex-row sm:flex-col items-center justify-between sm:justify-center p-5 sm:p-6 text-center gap-4">
              <h5 className="text-rose-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest sm:mb-3">추출된 마감일</h5>
              <div className="px-4 py-3 sm:p-4 bg-rose-50 rounded-xl sm:rounded-2xl border border-rose-100 shrink-0">
                <p className="text-lg sm:text-xl font-black text-rose-600">{data.deadline_date || "미발견"}</p>
                <p className="text-[8px] sm:text-[10px] text-rose-400 font-bold mt-0.5">계약 종료/갱신 예정</p>
              </div>
            </Card>
          </div>

          {/* Analysis Items */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2 ml-1">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" /> 세부 조항 분석 내역
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {data.analysis_items && data.analysis_items.map((item: any, idx: number) => (
                <div key={idx} className="group bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[11px] font-black uppercase ${item.is_unfair ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {item.is_unfair ? '불리조항' : '일반조항'}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-slate-800">{item.topic}</h4>
                      </div>
                      
                      <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 relative">
                        <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                          "{item.clause}"
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                           <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">⚖️ 관련 근거:</span>
                           <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">{item.legal_base}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-1">
                        {item.explanation}
                      </p>
                    </div>

                    <div className="lg:w-72 bg-indigo-50/50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-100 flex flex-col">
                       <h5 className="text-[10px] sm:text-[11px] font-black text-indigo-600 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-1">
                         <MessageSquare className="w-3 h-3" /> 추천 협상 포인트
                       </h5>
                       <p className="text-xs sm:text-sm text-indigo-900 font-medium italic mb-4 sm:mb-6 leading-relaxed">
                         "{item.negotiation_script}"
                       </p>
                       <button className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-indigo-100 rounded-xl text-[11px] sm:text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                         스크립트 복사 <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Chat Trigger */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-3 text-slate-400 text-[10px] sm:text-sm">
             <AlertCircle className="w-4 h-4 shrink-0" />
             AI 분석은 참고용이며 법률 전문가의 조언을 권장합니다.
           </div>
           <button 
             onClick={onOpenChat}
             className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#1E1B4B] text-white rounded-xl sm:rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm sm:text-base"
           >
             상담사에게 물어보기 <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  )
}
