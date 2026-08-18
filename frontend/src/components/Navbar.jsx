import React from 'react';
import { Bell, Moon, Calendar } from 'lucide-react';

export default function Navbar({ onTriggerReminder }) {
  const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="shrink-0 z-30 glass-panel border-b border-indigo-500/20 px-3 lg:px-8 py-2 sm:py-3 flex items-center justify-between bg-slate-950/95 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
            DirectorOS <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">Lịch Cá Nhân</span>
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
          title="Lập kế hoạch ngày mai"
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
