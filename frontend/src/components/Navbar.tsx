"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Settings as SettingsIcon, LogOut, User, Bell, Trash2, Calendar, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const loadNotifications = () => {
      const stored = localStorage.getItem("notifications");
      if (stored) {
        const all = JSON.parse(stored);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = all
          .map((n: any) => {
            const deadline = new Date(n.deadline);
            deadline.setHours(0, 0, 0, 0);
            const diffTime = deadline.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { ...n, diffDays };
          })
          .filter((n: any) => {
            // 오늘 기준 10일 이내일 때만 노출
            return n.diffDays >= 0 && n.diffDays <= 10;
          });
        setNotifications(filtered);
      }
    };

    loadNotifications();
    window.addEventListener("storage", loadNotifications);
    const interval = setInterval(loadNotifications, 2000);

    return () => {
      window.removeEventListener("storage", loadNotifications);
      clearInterval(interval);
    };
  }, []);

  const deleteNotification = (id: number) => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      const all = JSON.parse(stored);
      const updated = all.filter((n: any) => n.id !== id);
      localStorage.setItem("notifications", JSON.stringify(updated));
      // loadNotifications will handle the UI update via polling or storage event
    }
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "분석하기" },
    { href: "/dashboard", label: "대시보드" },
    { href: "/compare", label: "비교 분석" },
    { href: "#", label: "가이드라인" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-[10px] sm:rounded-[14px] flex items-center justify-center shadow-indigo-100 shadow-xl rotate-3">
            <Sparkles className="text-white w-4 h-4 sm:w-5 sm:h-5 fill-white/20" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1E1B4B]">
            AI-Lawyer <span className="text-indigo-600">.</span>
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8 text-[13px] font-bold text-slate-500 uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`${isActive(link.href) ? "text-indigo-600 border-b-2 border-indigo-600" : "hover:text-indigo-600"} pb-1 transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-900">{user.nickname}님</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all group"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="px-4 lg:px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  로그인
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 lg:px-6 py-2.5 bg-[#1E1B4B] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:-translate-y-0.5 transition-all"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 sm:p-2.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-all relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">계약 마감 알림</h3>
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {notifications.length}건
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-5 h-5 text-slate-300" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">새로운 알림이 없습니다</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors group">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-slate-800 truncate mb-1">{n.fileName}</p>
                                <div className="flex items-center gap-1.5 text-rose-500">
                                  <Calendar className="w-3 h-3" />
                                  <span className="text-[11px] font-black">마감일: {n.deadline}</span>
                                  <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${n.diffDays === 0 ? "bg-rose-600 text-white animate-pulse" : "bg-rose-100 text-rose-600"}`}>
                                    {n.diffDays === 0 ? "D-Day" : `D-${n.diffDays}`}
                                  </span>
                                </div>
                            </div>
                            <button 
                              onClick={() => deleteNotification(n.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="hidden sm:block p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <SettingsIcon className="w-4 h-4 text-slate-500" />
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl font-bold ${isActive(link.href) ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="pt-4 border-t border-slate-50">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-indigo-900">{user.nickname}님</span>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" /> 로그아웃
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-center text-sm font-bold text-slate-600 bg-slate-50 rounded-xl"
                >
                  로그인
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-center text-sm font-bold text-white bg-[#1E1B4B] rounded-xl"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
