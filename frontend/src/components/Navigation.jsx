import React from 'react';
import { CalendarCheck, Moon, ListTodo, Settings, Sparkles, BarChart3, Crown, UserCheck } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'today', label: 'Lịch Giám Đốc', icon: Crown, badge: 'EXECUTIVE' },
    { id: 'night', label: 'Lập Plan Tối 21:00', icon: Moon, badge: 'AUTO' },
    { id: 'tasks', label: 'Kho Chỉ Đạo', icon: ListTodo, badge: null },
    { id: 'analytics', label: 'Báo Cáo Hiệu Suất', icon: BarChart3, badge: 'NEW' },
    { id: 'settings', label: 'Cấu Hình Thư Ký', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-61px)]">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400/90 px-3 mb-3 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-amber-400" /> Executive Menu
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
                    ? 'bg-gradient-to-r from-amber-500/20 to-indigo-600/20 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${
                    item.badge === 'EXECUTIVE'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/30 via-indigo-950/20 to-slate-900 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Thư Ký AI Elena
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tự động tổng hợp lịch trình, phân tích chỉ đạo & nhắc nhở 21h hàng ngày cho Giám đốc.
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
                isActive ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
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
