import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, ChevronRight, Plus, Sparkles, Calendar, Download } from 'lucide-react';

export default function TodayPlanView({
  plan,
  tasks,
  onToggleItem,
  onOpenNewTaskModal,
  onGoToNightPlanner,
}) {

  if (!plan || !plan.items || plan.items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-12 border border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Chưa có kế hoạch cho hôm nay</h2>
            <p className="text-sm text-slate-400 mt-1">
              Hãy lên kế hoạch cho ngày hôm nay hoặc để hệ thống tự gợi ý cho bạn.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToNightPlanner}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Tự động lập kế hoạch
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

  const handleExportPlanIcs = (e) => {
    e.stopPropagation();
    if (plan.id) {
      window.open(`/api/calendar/export/plan/${plan.id}.ics`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 lg:p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-950 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Kế hoạch hôm nay ({plan.planDate})
              </span>
              <button
                onClick={handleExportPlanIcs}
                className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" /> Xuất .ics
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-white mt-2">
              Tiến độ {progressPercent}%
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 shrink-0">
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
            <span>Đã xong: {completedCount}/{totalCount} việc</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            Danh sách công việc
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
            const taskDetails = tasks.find(t => t.id === item.taskId) || { id: item.taskId, title: item.taskTitle };

            return (
              <div
                key={item.id || index}
                onClick={() => onToggleItem(item.id)}
                className={`glass-card p-4 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 ${
                  item.done ? 'opacity-60 bg-slate-900/40 border-slate-800/40' : 'hover:border-indigo-500/40 bg-gradient-to-r from-slate-900 to-slate-900/80'
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
                    <span className={`text-sm font-semibold truncate block ${item.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {item.taskTitle}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      {(item.scheduledTime || taskDetails?.scheduledTime) && (
                        <span className="font-bold text-indigo-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" /> {item.scheduledTime || taskDetails?.scheduledTime}
                        </span>
                      )}
                      {item.plannedMinutes && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" /> {item.plannedMinutes} phút
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
