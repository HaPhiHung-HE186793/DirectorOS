import React from 'react';
import { Calendar, Moon, ListTodo, Settings, Sparkles, CalendarCheck } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'calendar', label: 'Lịch', icon: Calendar, badge: null },
    { id: 'today', label: 'Kế Hoạch Hôm Nay', icon: CalendarCheck, badge: null },
    { id: 'night', label: 'Lập Plan Tối', icon: Moon, badge: null },
    { id: 'tasks', label: 'Công Việc', icon: ListTodo, badge: null },
    { id: 'settings', label: 'Cài Đặt', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-60 glass-panel border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-61px)]">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400/90 px-3 mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Menu
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/30 via-purple-950/20 to-slate-900 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> DirectorOS
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Lịch cá nhân thông minh — tổng hợp, nhắc nhở & lên kế hoạch mỗi ngày.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-2 flex items-center justify-around bg-slate-950/95 backdrop-blur-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
