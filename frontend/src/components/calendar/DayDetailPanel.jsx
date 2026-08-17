import React from 'react';
import { Calendar, Plus, Clock, Cake, Flag, Heart, Star, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { getLunarDateFull } from '../../utils/lunarCalendar';

export default function DayDetailPanel({ selectedDate, events, onAddEvent, onClose }) {
  if (!selectedDate) {
    return (
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 text-center min-h-[300px] flex flex-col items-center justify-center">
        <Calendar className="w-10 h-10 text-slate-600 mb-3" />
        <p className="text-sm text-slate-400 font-medium">Chọn một ngày trên lịch</p>
        <p className="text-xs text-slate-500 mt-1">để xem chi tiết sự kiện và kế hoạch</p>
      </div>
    );
  }

  const [y, m, d] = selectedDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });
  const formattedDate = dateObj.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  const lunarFull = getLunarDateFull(y, m, d);

  const specialEvents = events.filter(e => e.type === 'SPECIAL');
  const planEvents = events.filter(e => e.type === 'PLAN');
  const syncedEvents = events.filter(e => e.type === 'SYNCED');

  const renderSection = (title, icon, color, items, renderItem) => {
    if (items.length === 0) return null;
    return (
      <div>
        <h4 className={`text-[11px] font-bold uppercase ${color} tracking-wider mb-2 flex items-center gap-1.5`}>
          {icon} {title}
        </h4>
        <div className="space-y-2">{items.map(renderItem)}</div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-indigo-950/40 to-slate-900 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">{dayOfWeek}</p>
            <h3 className="text-lg font-extrabold text-white mt-0.5">{formattedDate}</h3>
            <p className="text-xs text-amber-400/80 mt-0.5 font-medium">{lunarFull}</p>
          </div>
          <div className="text-3xl font-black text-indigo-300/20">{d}</div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500">Không có sự kiện nào</p>
            <button onClick={onAddEvent} className="mt-3 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 mx-auto transition">
              <Plus className="w-3.5 h-3.5" /> Thêm sự kiện
            </button>
          </div>
        ) : (
          <>
            {renderSection('Ngày đặc biệt', <Star className="w-3 h-3" />, 'text-rose-400', specialEvents, (ev) => (
              <div key={ev.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-base mt-0.5">{ev.icon || '📌'}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-100 truncate">{ev.title}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: (ev.color || '#f59e0b') + '20', color: ev.color }}>
                    {ev.eventType === 'BIRTHDAY' ? 'Sinh nhật' : ev.eventType === 'HOLIDAY' ? 'Ngày lễ' : ev.eventType === 'ANNIVERSARY' ? 'Kỷ niệm' : 'Tùy chỉnh'}
                  </span>
                  {ev.note && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ev.note}</p>}
                </div>
              </div>
            ))}

            {renderSection('Kế hoạch', <CheckCircle2 className="w-3 h-3" />, 'text-blue-400', planEvents, (ev) => (
              <div key={ev.id} className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${ev.done ? 'bg-emerald-950/20 border-emerald-800/30 opacity-60' : 'bg-slate-800/50 border-slate-700/50'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${ev.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>{ev.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    {ev.scheduledTime && <span className="flex items-center gap-1 text-blue-300"><Clock className="w-3 h-3" /> {ev.scheduledTime}</span>}
                    {ev.plannedMinutes && <span>{ev.plannedMinutes} phút</span>}
                  </div>
                </div>
              </div>
            ))}

            {renderSection('Lịch email', <Briefcase className="w-3 h-3" />, 'text-purple-400', syncedEvents, (ev) => (
              <div key={ev.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-1 h-8 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: ev.color || '#8b5cf6' }} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-100 truncate">{ev.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    {ev.startTime && <span className="text-purple-300"><Clock className="w-3 h-3 inline" /> {ev.startTime.substring(0,5)} - {ev.endTime?.substring(0,5)}</span>}
                    {ev.accountName && <span className="text-slate-500">{ev.accountName}</span>}
                  </div>
                </div>
              </div>
            ))}

            <button onClick={onAddEvent} className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-700/50 flex items-center justify-center gap-1.5 transition">
              <Plus className="w-3.5 h-3.5" /> Thêm sự kiện cho ngày này
            </button>
          </>
        )}
      </div>
    </div>
  );
}
