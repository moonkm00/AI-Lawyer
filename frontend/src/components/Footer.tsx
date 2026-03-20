"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin, Github, Twitter, Instagram, ArrowUpRight, AlertCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-4 sm:px-6 lg:px-10 relative z-10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-50/50 blur-[100px] rounded-full -mr-20 -mb-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
                <Sparkles className="text-white w-4 h-4 fill-white/20" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#1E1B4B]">
                AI-Lawyer <span className="text-indigo-600">.</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
              복잡한 법률 조항과 리스크를 AI가 정밀 분석하여 비즈니스를 안전하게 보호합니다. 24시간 실시간 법률 조력자를 만나보세요.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Github, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              주요 서비스
              <div className="h-px bg-indigo-100 flex-1"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { label: "계약서 정밀 분석", href: "/" },
                { label: "실시간 AI 상담", href: "/" },
                { label: "대시보드 통계", href: "/dashboard" },
                { label: "계약서 비교 분석", href: "/compare" }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-0 h-0 group-hover:w-3 group-hover:h-3 transition-all opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              고객 서비스
              <div className="h-px bg-indigo-100 flex-1"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { label: "이용 가이드", href: "#" },
                { label: "자주 묻는 질문", href: "#" },
                { label: "개인정보 처리방침", href: "#" },
                { label: "이용약관", href: "#" }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              문의하기
              <div className="h-px bg-indigo-100 flex-1"></div>
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">이메일 문의</p>
                  <p className="text-sm font-bold text-slate-700">support@ai-lawyer.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">고객센터</p>
                  <p className="text-sm font-bold text-slate-700">02-123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">오시는 길</p>
                  <p className="text-sm font-bold text-slate-700">서울특별시 강남구 테헤란로 123</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mb-12 p-5 bg-slate-50/50 rounded-[24px] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-50">
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
            <span className="font-bold text-slate-800 mr-2">면책 조항:</span> 
            AI-Lawyer는 인공지능 기술을 기반으로 법률적 조언이 아닌 참고 정보를 제공합니다. 본 서비스의 분석 결과는 법적 효력을 갖지 않으며, 이를 바탕으로 진행된 모든 계약 및 결정에 대한 책임은 사용자 본인에게 있습니다. 복잡하거나 중요한 사안의 경우 반드시 법률 전문가의 자문을 받으시기 바랍니다.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-[13px] font-medium">
            © {currentYear} AI-Lawyer Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">System Operational</span>
            </div>
            <div className="text-slate-400 text-[13px] font-medium hidden sm:block">
              With AI-Lawyer
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
