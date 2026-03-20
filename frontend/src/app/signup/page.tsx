"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await response.json();

      if (response.ok) {
        login({ userId: data.userId, email: data.email, nickname: data.nickname }, data.token);
        router.push("/");
      } else {
        setError(data.message || "회원가입에 실패했습니다. 정보를 다시 확인해 주세요.");
      }
    } catch (err) {
      setError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Background elements are handled by layout */}

      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-indigo-100 p-6 sm:p-10 border border-white/50">
          <div className="flex flex-col items-center mb-8 sm:mb-10 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200 mb-4 sm:mb-6 -rotate-3">
              <Sparkles className="text-white w-6 h-6 sm:w-8 sm:h-8 fill-white/20" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] tracking-tight mb-2">새로운 계정 등록</h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium">전담 AI 법률 비서를 만나보세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[11px] sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest ml-1">성함 / 닉네임</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 focus:bg-white focus:border-indigo-100 outline-none transition-all font-medium text-sm sm:text-base text-slate-800"
                  placeholder="홍길동"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[11px] sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest ml-1">이메일 주소</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 focus:bg-white focus:border-indigo-100 outline-none transition-all font-medium text-sm sm:text-base text-slate-800"
                  placeholder="ceo@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[11px] sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest ml-1">비밀번호 설정</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 focus:bg-white focus:border-indigo-100 outline-none transition-all font-medium text-sm sm:text-base text-slate-800"
                  placeholder="안전한 비밀번호 입력"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-bold border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-xl sm:rounded-2xl py-3.5 sm:py-4 font-black flex items-center justify-center gap-2 group hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "작성 중..." : "서비스 가입하기"}
              {!loading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              아직 계정이 있으신가요? 
              <Link href="/login" className="text-indigo-600 font-bold ml-2 hover:underline tracking-tight">로그인 하기</Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-indigo-400" />
              보안 인증
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-indigo-400" />
              데이터 암호화
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
