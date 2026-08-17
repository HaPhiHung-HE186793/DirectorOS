import React, { useState } from 'react';
import { X, Cake, Flag, Heart, Star, Calendar } from 'lucide-react';

const EVENT_TYPES = [
  { value: 'BIRTHDAY', label: 'Sinh nhật', icon: '🎂', color: '#ec4899' },
  { value: 'HOLIDAY', label: 'Ngày lễ', icon: '🎉', color: '#ef4444' },
  { value: 'ANNIVERSARY', label: 'Kỷ niệm', icon: '💝', color: '#8b5cf6' },
  { value: 'CUSTOM', label: 'Tùy chỉnh', icon: '📌', color: '#3b82f6' },
];

export default function AddSpecialDateModal({ defaultDate, onClose, onSubmit }) {
  const today = defaultDate || new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(today);
  const [eventType, setEventType] = useState('BIRTHDAY');
  const [recurringYearly, setRecurringYearly] = useState(true);
  const [isLunarBased, setIsLunarBased] = useState(false);
  const [note, setNote] = useState('');
  const [icon, setIcon] = useState('🎂');
  const [color, setColor] = useState('#ec4899');

  const handleTypeChange = (type) => {
    setEventType(type);
    const typeObj = EVENT_TYPES.find(t => t.value === type);
    if (typeObj) {
      setIcon(typeObj.icon);
      setColor(typeObj.color);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;
    onSubmit({
      title: title.trim(),
      eventDate,
      eventType,
      recurringYearly,
      isLunarBased,
      note: note.trim() || null,
      icon,
      color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" /> Thêm ngày đặc biệt
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Tên sự kiện *</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Sinh nhật Mẹ, Ngày kỷ niệm..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              autoFocus required
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Ngày *</label>
            <input
              type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Loại sự kiện</label>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value} type="button"
                  onClick={() => handleTypeChange(type.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition border ${
                    eventType === type.value
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'bg-slate-800 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{type.icon}</span> {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="checkbox" checked={recurringYearly} onChange={(e) => setRecurringYearly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
              <span>Lặp lại hàng năm</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="checkbox" checked={isLunarBased} onChange={(e) => setIsLunarBased(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
              <span>Tính theo Âm lịch</span>
            </label>
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Ghi chú</label>
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)} rows={2}
              placeholder="Ghi chú thêm (tuỳ chọn)..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-sm transition active:scale-[0.98] shadow-lg shadow-indigo-600/20"
          >
            Lưu ngày đặc biệt
          </button>
        </form>
      </div>
    </div>
  );
}
