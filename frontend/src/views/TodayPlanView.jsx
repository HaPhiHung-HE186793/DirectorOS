import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, Briefcase, ChevronRight, Plus, Sparkles, Calendar, Download } from 'lucide-react';
import { getGoogleCalendarUrl } from '../services/api';

export default function TodayPlanView({ plan, tasks, onToggleItem, onOpenNewTaskModal, onGoToNightPlanner }) {
  if (!plan || !plan.items || plan.items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-12 border border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Chưa có Plan cho hôm nay</h2>
            <p className="text-sm text-slate-400 mt-1">
              Bạn chưa lập kế hoạch công việc cho hôm nay. Bạn có muốn kích hoạt hệ thống tự động tổng hợp Plan không?
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToNightPlanner}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Lập Plan tự động ngay
            </button>
            <button
              onClick={onOpenNewTaskModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/50 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Thêm việc mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = plan.items.filter(i => i.done).length;
  const totalCount = plan.items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const totalPlannedMinutes = plan.items.reduce((acc, item) => acc + (item.plannedMinutes || 30), 0);

  const handleOpenGoogleCalendar = async (e, item) => {
    e.stopPropagation();
    const url = await getGoogleCalendarUrl(item.taskId, item.taskTitle);
    window.open(url, '_blank');
  };

  const handleExportPlanIcs = (e) => {
    e.stopPropagation();
    if (plan.id) {
      window.open(`/api/calendar/export/plan/${plan.id}.ics`, '_blank');
    } else {
      alert("Xuất file .ics thành công (Simulated for local state).");
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Progress Header */}
      <div className="glass-panel p-5 lg:p-6 rounded-2xl border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                Kế hoạch hôm nay ({plan.planDate})
              </span>
              <button
                onClick={handleExportPlanIcs}
                className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition"
                title="Xuất file .ics để nhập vào Apple/Google Calendar"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" /> Xuất Lịch (.ics)
              </button>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              Tiến độ hoàn thành {progressPercent}%
            </h2>
            {plan.note && (
              <p className="text-xs text-slate-400 mt-1 italic max-w-lg">
                "{plan.note}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400">Tổng thời gian dự kiến</div>
              <div className="text-sm font-bold text-indigo-300 flex items-center justify-end gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-indigo-400" /> {totalPlannedMinutes} phút (~{(totalPlannedMinutes/60).toFixed(1)}h)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Đã làm: {completedCount}/{totalCount} task</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Danh sách việc cần hoàn thành
          </h3>
          <button
            onClick={onOpenNewTaskModal}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm việc
          </button>
        </div>

        <div className="space-y-2.5">
          {plan.items.map((item, index) => {
            const taskDetails = tasks.find(t => t.id === item.taskId);
            const isBossTask = taskDetails?.source === 'BOSS';

            return (
              <div
                key={item.id || index}
                onClick={() => onToggleItem(item.id)}
                className={`glass-card p-4 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 ${
                  item.done ? 'opacity-60 bg-slate-900/40 border-slate-800/40' : 'hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button className="shrink-0 transition-transform active:scale-125">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold truncate ${item.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {item.taskTitle}
                      </span>

                      {isBossTask && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Sếp giao
                        </span>
                      )}

                      {taskDetails?.priority === 'URGENT' && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                          VIỆC GẤP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      {item.plannedMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {item.plannedMinutes} phút
                        </span>
                      )}
                      {taskDetails?.assignedBy && (
                        <span>Giao bởi: <strong className="text-slate-300">{taskDetails.assignedBy}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleOpenGoogleCalendar(e, item)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 transition"
                    title="Thêm vào Google Calendar"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
