import React, { useState } from 'react';
import { Moon, Sparkles, AlertTriangle, Briefcase, Plus, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function NightPlannerView({ candidateTasks, onCreatePlan, onGoToToday }) {
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedTaskIds, setSelectedTaskIds] = useState(candidateTasks.map(t => t.id));
  const [note, setNote] = useState("Plan tập trung xử lý công việc sếp giao và việc tồn đọng.");

  const toggleSelect = (id) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter(x => x !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const handleSave = () => {
    const items = selectedTaskIds.map((id, index) => {
      const task = candidateTasks.find(t => t.id === id);
      return {
        taskId: id,
        orderIndex: index + 1,
        plannedMinutes: task?.estimatedMinutes || 30,
        done: false
      };
    });

    onCreatePlan({
      planDate: tomorrowStr,
      note,
      items
    });
  };

  const bossTasks = candidateTasks.filter(t => t.source === 'BOSS');

  return (
    <div className="space-y-6">
      {/* Night Routine Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
            <Moon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Routines Lập Plan Tối (21:00)</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Lên plan ngày {tomorrowStr}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              Trước khi đi ngủ, hệ thống đã tự động lọc các công việc sếp giao, việc quá hạn và việc quan trọng giúp bạn không phải tự lên bàn ngồi nhớ trước quên sau.
            </p>
          </div>
        </div>
      </div>

      {/* Warning Box for Boss tasks */}
      {bossTasks.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs text-amber-200">
            <strong>Cảnh báo:</strong> Bạn đang có <strong className="text-amber-400 font-bold">{bossTasks.length} việc do sếp giao</strong> dở dang chưa hoàn thành. Hệ thống đã ưu tiên đưa vào Plan ngày mai!
          </div>
        </div>
      )}

      {/* Candidate Tasks Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Đề xuất công việc ngày mai ({selectedTaskIds.length}/{candidateTasks.length} chọn)
          </h3>
        </div>

        <div className="space-y-2.5">
          {candidateTasks.map((task) => {
            const isSelected = selectedTaskIds.includes(task.id);
            const isBoss = task.source === 'BOSS';

            return (
              <div
                key={task.id}
                onClick={() => toggleSelect(task.id)}
                className={`glass-card p-4 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'border-indigo-500/50 bg-indigo-950/20' : 'opacity-60 border-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-900"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-100">{task.title}</span>
                      {isBoss && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Sếp giao
                        </span>
                      )}
                      {task.priority === 'URGENT' && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          Gấp
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {task.estimatedMinutes || 30} phút
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Ghi chú mục tiêu cho ngày mai:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-none h-20"
          placeholder="Nhập ghi chú hoặc nguyên tắc làm việc cho ngày mai..."
        />
      </div>

      {/* Action Button */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" /> Chốt Plan ngày mai ({tomorrowStr})
        </button>
      </div>
    </div>
  );
}
