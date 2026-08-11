import React, { useState } from 'react';
import { Zap, Plus, Briefcase, AlertTriangle, Calendar } from 'lucide-react';

export default function QuickAddTaskBar({ onCreateTask }) {
  const [inputText, setInputText] = useState('');

  const textLower = inputText.toLowerCase();
  const isBoss = textLower.includes('sếp') || textLower.includes('boss') || textLower.includes('giao');
  const isUrgent = textLower.includes('gấp') || textLower.includes('urgent') || textLower.includes('khẩn');
  const isToday = textLower.includes('hôm nay') || textLower.includes('today');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let assignedBy = null;
    if (isBoss) {
      const match = inputText.match(/(?:sếp|boss)\s+([\p{L}\w]+)/iu);
      assignedBy = match ? `Sếp ${match[1]}` : 'Sếp';
    }

    let dueDate = new Date();
    if (!isToday) {
      dueDate.setDate(dueDate.getDate() + 1); // default tomorrow
    }
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const taskData = {
      title: inputText.trim(),
      description: 'Tạo nhanh qua thanh Quick Add 1 dòng.',
      status: 'PENDING',
      priority: isUrgent ? 'URGENT' : 'MEDIUM',
      source: isBoss ? 'BOSS' : 'SELF',
      assignedBy: assignedBy,
      dueDate: dueDateStr,
      estimatedMinutes: isUrgent ? 60 : 45
    };

    onCreateTask(taskData);
    setInputText('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-2.5 sm:p-3 rounded-2xl space-y-2 border border-indigo-500/30 bg-slate-900/80 shadow-xl shadow-indigo-950/20">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Thêm nhanh task 1 dòng: VD 'Sếp Minh giao làm slide quý 3 gấp ngày mai'..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-1"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tạo nhanh</span>
        </button>
      </div>

      {/* Realtime Smart Keyword Badges Preview */}
      {inputText.trim().length > 0 && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 px-1 flex-wrap text-[11px]">
          <span className="text-slate-400">Tự động nhận diện:</span>
          {isBoss && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 font-medium">
              <Briefcase className="w-3 h-3" /> Nguồn: Sếp giao
            </span>
          )}
          {isUrgent && (
            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3 h-3" /> Ưu tiên: VIỆC GẤP
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3" /> Hạn: {isToday ? 'Hôm nay' : 'Ngày mai'}
          </span>
        </div>
      )}
    </form>
  );
}
