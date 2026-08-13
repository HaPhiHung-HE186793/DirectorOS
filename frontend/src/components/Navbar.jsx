import React from 'react';
import { Sparkles, Bell, Moon, Calendar, Crown, Volume2 } from 'lucide-react';

export default function Navbar({ onTriggerReminder, onOpenBriefing }) {
  const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-amber-500/20 px-4 lg:px-8 py-3 flex items-center justify-between bg-slate-950/90 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
          <Crown className="w-5 h-5 animate-pulse text-amber-300" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
            DirectorOS <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">Thư Ký AI Giám Đốc</span>
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{todayFormatted}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={onOpenBriefing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
          title="Mở Báo cáo Thư ký AI"
        >
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Báo Cáo Thư Ký</span>
        </button>

        <button
          onClick={onTriggerReminder}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all duration-200 active:scale-95"
          title="Kích hoạt mô phỏng chạy nhắc nhở 21:00"
        >
          <Moon className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Plan Tối (21h)</span>
        </button>

        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300">
          <Bell className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
