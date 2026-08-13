import React from 'react';
import { Clock, CheckCircle2, Circle, Flame, Calendar, Crown, Briefcase, AlertCircle, FileCheck } from 'lucide-react';
import { getGoogleCalendarUrl } from '../services/api';

export default function ExecutiveTimeline({ items, tasks, onToggleItem, onOpenPomodoro }) {
  const timeSlots = [
    { label: '08:00 - 09:00', title: 'Báo cáo Đầu ngày & Phê duyệt sớm', defaultType: 'ROUTINE' },
    { label: '09:00 - 10:30', title: 'Họp Điều hành & Đối tác Chiến lược', defaultType: 'MEETING' },
    { label: '10:30 - 11:30', title: 'Duyệt Đề xuất & Quyết định trọng tâm', defaultType: 'DECISION' },
    { label: '11:30 - 13:30', title: 'Nghỉ trưa & Recharge Giám đốc', defaultType: 'REST' },
    { label: '13:30 - 15:30', title: 'Deep Work Chiến lược & Dự án lớn', defaultType: 'STRATEGIC' },
    { label: '15:30 - 17:00', title: 'Họp Review KPI & Chỉ đạo Cấp dưới', defaultType: 'DELEGATION' },
    { label: '17:00 - 17:30', title: 'Tổng kết ngày với Thư ký AI', defaultType: 'ROUTINE' }
  ];

  const handleOpenGoogleCalendar = async (e, taskId, title) => {
    e.stopPropagation();
    const url = await getGoogleCalendarUrl(taskId, title);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Lịch Trình Chi Tiết Giám Đốc (Timeline Theo Giờ)
        </h3>
        <span className="text-xs text-slate-400">Tự động sắp xếp bởi Thư ký AI</span>
      </div>

      <div className="relative border-l-2 border-indigo-500/30 pl-4 lg:pl-6 space-y-6">
        {timeSlots.map((slot, sIdx) => {
          // Find item for this slot or tasks matching scheduledTime
          const matchedItem = items?.find(item => {
            if (item.scheduledTime) return item.scheduledTime.includes(slot.label.split(' ')[0]);
            const task = tasks?.find(t => t.id === item.taskId);
            return task?.scheduledTime && task.scheduledTime.includes(slot.label.split(' ')[0]);
          }) || items?.[sIdx];

          const taskDetails = matchedItem ? tasks?.find(t => t.id === matchedItem.taskId) : null;
          const isDone = matchedItem?.done;

          const isRest = slot.defaultType === 'REST';

          return (
            <div key={sIdx} className="relative group">
              {/* Timeline node icon */}
              <div className={`absolute -left-[25px] lg:-left-[33px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isDone
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                  : matchedItem
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>

              <div className={`glass-card p-4 rounded-xl transition-all duration-200 ${
                isRest
                  ? 'bg-slate-900/40 border-slate-800/40 opacity-75'
                  : matchedItem
                  ? 'border-indigo-500/30 hover:border-indigo-500/60 bg-gradient-to-r from-slate-900 to-indigo-950/20'
                  : 'border-slate-800/60 bg-slate-900/30'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {slot.label}
                      </span>

                      {slot.defaultType === 'DECISION' && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" /> Khung Duyệt Văn Bản
                        </span>
                      )}

                      {slot.defaultType === 'MEETING' && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-purple-400" /> Khung Họp Đối Tác
                        </span>
                      )}

                      {isRest && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          ☕ Nghỉ Trưa & Tái Tạo Năng Lượng
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5">
                      {matchedItem ? (
                        <div
                          onClick={() => onToggleItem && onToggleItem(matchedItem.id)}
                          className="cursor-pointer group-hover:text-indigo-300 transition"
                        >
                          <h4 className={`text-sm font-bold flex items-center gap-2 ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                            {matchedItem.taskTitle}
                          </h4>
                          {taskDetails?.description && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{taskDetails.description}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          {slot.title} (Khung giờ sẵn sàng cho công việc linh hoạt)
                        </p>
                      )}
                    </div>
                  </div>

                  {matchedItem && (
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onOpenPomodoro && onOpenPomodoro(taskDetails || { id: matchedItem.taskId, title: matchedItem.taskTitle })}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1 transition"
                        title="Tập trung Pomodoro"
                      >
                        <Flame className="w-3.5 h-3.5 fill-rose-500" /> Focus
                      </button>
                      <button
                        onClick={(e) => handleOpenGoogleCalendar(e, matchedItem.taskId, matchedItem.taskTitle)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 transition"
                        title="Lên lịch Google Calendar"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
