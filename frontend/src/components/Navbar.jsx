import React from 'react';
import { Sparkles, Bell, CheckCircle2, Moon, Calendar } from 'lucide-react';

export default function Navbar({ onTriggerReminder, activeTab }) {
  const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
            myTask <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">v1.0 Pro</span>
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="capitalize">{todayFormatted}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={onTriggerReminder}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all duration-200 active:scale-95"
          title="Kích hoạt mô phỏng chạy nhắc nhở 21:00"
        >
          <Moon className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Nạp Plan 21:00</span>
        </button>

        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300">
          <Bell className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
