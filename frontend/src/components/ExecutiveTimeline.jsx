import React from 'react';
import { Clock, CheckCircle2, Circle, Flame, Calendar, Crown, Briefcase, MapPin, Coffee } from 'lucide-react';
import { getGoogleCalendarUrl } from '../services/api';

export default function ExecutiveTimeline({ items, tasks, onToggleItem, onOpenPomodoro }) {
  const timeSlots = [
    { hour: 8, label: '08:00', slotRange: '08:00 - 09:00', title: 'Báo cáo Đầu ngày & Phê duyệt sớm', defaultType: 'ROUTINE' },
    { hour: 9, label: '09:00', slotRange: '09:00 - 10:30', title: 'Họp Điều hành & Đối tác Chiến lược', defaultType: 'MEETING' },
    { hour: 10, label: '10:00', slotRange: '10:30 - 11:30', title: 'Duyệt Đề xuất & Quyết định trọng tâm', defaultType: 'DECISION' },
    { hour: 11, label: '11:00', slotRange: '11:30 - 12:00', title: 'Rà soát danh mục đầu tư & KPI', defaultType: 'STRATEGIC' },
    { hour: 12, label: '12:00', slotRange: '12:00 - 13:30', title: 'Nghỉ trưa & Tái tạo năng lượng Giám đốc', defaultType: 'REST' },
    { hour: 13, label: '13:00', slotRange: '13:30 - 15:30', title: 'Deep Work Chiến lược & Dự án trọng điểm', defaultType: 'STRATEGIC' },
    { hour: 14, label: '14:00', slotRange: '14:00 - 15:30', title: 'Test & Phát triển Sản phẩm bằng AI', defaultType: 'MEETING' },
    { hour: 15, label: '15:00', slotRange: '15:30 - 17:00', title: 'Họp Review KPI & Chỉ đạo Cấp dưới', defaultType: 'DELEGATION' },
    { hour: 16, label: '16:00', slotRange: '16:00 - 17:00', title: 'Duyệt ngân sách & Kế hoạch tài chính', defaultType: 'DECISION' },
    { hour: 17, label: '17:00', slotRange: '17:00 - 17:30', title: 'Tổng kết ngày với Thư ký AI', defaultType: 'ROUTINE' },
    { hour: 18, label: '18:00', slotRange: '18:00 - 19:00', title: 'Nghỉ ngơi & Thể thao', defaultType: 'REST' },
    { hour: 19, label: '19:00', slotRange: '19:00 - 20:00', title: 'Ăn tối & Thời gian gia đình', defaultType: 'REST' },
    { hour: 20, label: '20:00', slotRange: '20:00 - 21:30', title: 'Lập kế hoạch đêm với Thư ký AI (Night Planner)', defaultType: 'ROUTINE' }
  ];

  const today = new Date();
  const daysOfWeekVi = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayNameStr = daysOfWeekVi[today.getDay()].toUpperCase();
  const dayNum = today.getDate();
  const monthNum = today.getMonth() + 1;
  const yearNum = today.getFullYear();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const handleOpenGoogleCalendar = async (e, taskId, title) => {
    e.stopPropagation();
    const url = await getGoogleCalendarUrl(taskId, title);
    window.open(url, '_blank');
  };

  return (
    <div className="glass-panel p-5 lg:p-6 rounded-2xl border border-indigo-500/30 bg-slate-900/90 shadow-2xl space-y-6">
      {/* Calendar Header Day View Badge (Google Calendar Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 border border-indigo-400/30">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-90">{dayNameStr.split(' ')[0] + ' ' + (dayNameStr.split(' ')[1] || '')}</span>
            <span className="text-2xl font-black leading-none">{dayNum}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold uppercase">
                Hôm Nay
              </span>
              <span className="text-xs font-mono text-slate-400">GMT+07</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              {daysOfWeekVi[today.getDay()]}, Ngày {dayNum} Tháng {monthNum}, {yearNum}
            </h3>
            <p className="text-xs text-slate-400">Giao diện lịch trực quan theo giờ (Google Calendar Style)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
          <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Bây giờ: <strong className="text-amber-300 font-mono">{String(currentHour).padStart(2, '0')}:{String(currentMinute).padStart(2, '0')}</strong></span>
        </div>
      </div>

      {/* Hourly Timeline Grid View */}
      <div className="relative pt-2">
        {/* Time Slots Grid */}
        <div className="space-y-4">
          {timeSlots.map((slot, index) => {
            const matchedItem = items?.find(item => {
              if (item.scheduledTime) return item.scheduledTime.includes(slot.label);
              const task = tasks?.find(t => t.id === item.taskId);
              return task?.scheduledTime && task.scheduledTime.includes(slot.label);
            }) || items?.[index];

            const taskDetails = matchedItem ? tasks?.find(t => t.id === matchedItem.taskId) : null;
            const isDone = matchedItem?.done;
            const isRest = slot.defaultType === 'REST';
            const isCurrentSlot = currentHour === slot.hour;

            return (
              <div key={index} className="relative flex items-start gap-4 group">
                {/* Left Hour Axis Label */}
                <div className="w-16 shrink-0 text-right font-mono text-xs font-bold text-slate-400 pt-3 flex flex-col items-end">
                  <span>{slot.label}</span>
                  <span className="text-[10px] text-slate-600 font-normal">GMT+7</span>
                </div>

                {/* Horizontal Hourly Divider Line */}
                <div className="flex-1 relative pt-2">
                  <div className="absolute top-5 left-0 right-0 h-[1px] bg-slate-800/80 group-hover:bg-indigo-500/20 transition" />

                  {/* Current Time Indicator Line (If current hour) */}
                  {isCurrentSlot && (
                    <div className="absolute top-5 left-0 right-0 z-10 flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500 -ml-1.5" />
                      <div className="flex-1 h-[2px] bg-gradient-to-r from-rose-500 to-rose-500/20" />
                    </div>
                  )}

                  {/* Event Block Card */}
                  <div className={`relative z-0 p-3.5 rounded-xl border transition-all duration-200 shadow-md ${
                    isRest
                      ? 'bg-slate-950/40 border-slate-800/50 text-slate-400'
                      : matchedItem
                      ? isDone
                        ? 'bg-slate-950/60 border-slate-800 opacity-60'
                        : slot.defaultType === 'MEETING' || taskDetails?.taskCategory === 'MEETING'
                        ? 'bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/30 border-purple-500/40 hover:border-purple-400 text-white'
                        : slot.defaultType === 'DECISION' || taskDetails?.isDirectorDecision
                        ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 hover:border-amber-400 text-white'
                        : 'bg-gradient-to-r from-slate-900 to-indigo-950/20 border-indigo-500/30 hover:border-indigo-400 text-white'
                      : 'bg-slate-950/20 border-slate-800/40 hover:bg-slate-900/40 text-slate-500'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        {/* Tags / Time Range */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {slot.slotRange}
                          </span>

                          {slot.defaultType === 'MEETING' && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                              <Briefcase className="w-3 h-3 text-purple-400" /> Cuộc Họp
                            </span>
                          )}

                          {slot.defaultType === 'DECISION' && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-400" /> Phê Duyệt Trọng Tâm
                            </span>
                          )}

                          {isRest && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <Coffee className="w-3 h-3" /> Khung Nghỉ Trưa & Tái Tạo
                            </span>
                          )}

                          {taskDetails?.priority === 'URGENT' && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              ⚡ URGENT
                            </span>
                          )}
                        </div>

                        {/* Event Title & Details */}
                        <div>
                          {matchedItem ? (
                            <div
                              onClick={() => onToggleItem && onToggleItem(matchedItem.id)}
                              className="cursor-pointer group/title"
                            >
                              <h4 className={`text-sm font-bold flex items-center gap-2 ${isDone ? 'line-through text-slate-500' : 'text-slate-100 group-hover/title:text-indigo-300'}`}>
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-indigo-400 shrink-0" />
                                )}
                                <span>{matchedItem.taskTitle}</span>
                              </h4>
                              {(taskDetails?.description || taskDetails?.location) && (
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                  {taskDetails?.location && (
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <MapPin className="w-3 h-3 text-rose-400" /> {taskDetails.location}
                                    </span>
                                  )}
                                  {taskDetails?.description && <span>{taskDetails.description}</span>}
                                </p>
                              )}
                            </div>
                          ) : (
                            <h4 className="text-xs font-semibold text-slate-400 italic">
                              {slot.title} (Khung giờ làm việc linh hoạt)
                            </h4>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      {matchedItem && (
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => onOpenPomodoro && onOpenPomodoro(taskDetails || { id: matchedItem.taskId, title: matchedItem.taskTitle })}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1 transition active:scale-95"
                            title="Tập trung Pomodoro"
                          >
                            <Flame className="w-3.5 h-3.5 fill-rose-500" /> Focus
                          </button>
                          <button
                            onClick={(e) => handleOpenGoogleCalendar(e, matchedItem.taskId, matchedItem.taskTitle)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700 transition"
                            title="Đồng bộ Google Calendar"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

