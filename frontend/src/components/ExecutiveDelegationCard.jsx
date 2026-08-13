import React, { useState } from 'react';
import { UserCheck, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { triggerDelegationFollowup } from '../services/api';

export default function ExecutiveDelegationCard({ delegatedTasks = [] }) {
  const [followupStatus, setFollowupStatus] = useState({});

  const handleFollowup = async (taskId) => {
    setFollowupStatus(prev => ({ ...prev, [taskId]: 'sending' }));
    const res = await triggerDelegationFollowup(taskId);
    if (res.success) {
      setFollowupStatus(prev => ({ ...prev, [taskId]: 'sent' }));
      setTimeout(() => {
        setFollowupStatus(prev => ({ ...prev, [taskId]: null }));
      }, 4000);
    }
  };

  if (delegatedTasks.length === 0) {
    return (
      <div className="glass-card p-4 border border-slate-800/80 rounded-2xl bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <UserCheck className="w-4 h-4 text-indigo-400" /> Tiến độ chỉ đạo cấp dưới
        </div>
        <p className="text-xs text-slate-500 italic">Chưa có công việc nào được ủy quyền cho các Trưởng phòng hôm nay.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 border border-indigo-500/20 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
            Tiến độ chỉ đạo cấp dưới ({delegatedTasks.length})
          </h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Auto Follow-up
        </span>
      </div>

      <div className="space-y-2.5">
        {delegatedTasks.map((task) => {
          const isSent = followupStatus[task.id] === 'sent';
          const isSending = followupStatus[task.id] === 'sending';
          return (
            <div
              key={task.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-indigo-500/30 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {task.assignedBy || 'Trưởng phòng'}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> Hạn: {task.dueDate || 'Hôm nay'}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100 truncate">{task.title}</h4>
              </div>

              <button
                onClick={() => handleFollowup(task.id)}
                disabled={isSending || isSent}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                  isSent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isSending
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
                    : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                }`}
                title="Gửi tin nhắn Telegram thúc tiến độ báo cáo"
              >
                {isSent ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Đã Nhắc
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-indigo-400" /> {isSending ? 'Đang gửi...' : 'Thúc Tiến Độ'}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
