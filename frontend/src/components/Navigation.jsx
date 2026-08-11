import React from 'react';
import { CalendarCheck, Moon, ListTodo, Settings, Sparkles, BarChart3 } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'today', label: 'Hôm nay', icon: CalendarCheck, badge: null },
    { id: 'night', label: 'Lập Plan tối 21:00', icon: Moon, badge: 'AUTO' },
    { id: 'tasks', label: 'Kho Nhiệm vụ', icon: ListTodo, badge: null },
    { id: 'analytics', label: 'Phân tích Hiệu suất', icon: BarChart3, badge: 'NEW' },
    { id: 'settings', label: 'Thông báo & Cấu hình', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-61px)]">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
          Menu Quản lý
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Auto Remind 21:00
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tự động cảnh báo việc sếp giao & việc ngâm qua Telegram/Email lúc 9h tối.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (PWA Mobile Experience) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-indigo-400 font-semibold scale-105' : 'text-slate-400 hover:text-slate-200'
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
