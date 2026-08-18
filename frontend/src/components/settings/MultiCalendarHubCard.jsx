import React from 'react';
import { Calendar, RefreshCw, Plus, Trash2, Pencil, AlertTriangle } from 'lucide-react';

export const MultiCalendarHubCard = ({
  calendars,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteCalendar,
  onSyncCalendars,
  syncing,
  syncReport
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Trung Tâm Kết Nối Đa Email & Lịch Trình (Multi-Calendar Hub)</h3>
            <p className="text-xs text-slate-400">Kết nối iCal Secret URL hoặc Google/Outlook OAuth2 để phát hiện xung đột lịch</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSyncCalendars}
            disabled={syncing}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Đang Quét...' : 'Đồng Bộ & Quét Trùng Lịch'}
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Email
          </button>
        </div>
      </div>

      {/* Connected Accounts List */}
      <div className="space-y-2 pt-2">
        {calendars.length === 0 ? (
          <div className="p-4 bg-slate-900/60 rounded-xl text-center text-xs text-slate-400 border border-slate-800/80">
            Chưa có tài khoản Email nào được kết nối. Bấm "+ Thêm Email" để bắt đầu.
          </div>
        ) : (
          calendars.map((cal) => (
            <div
              key={cal.id}
              className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cal.colorTag || '#3b82f6' }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white">{cal.accountName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {cal.calendarType}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{cal.emailAddress}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold mr-1">
                  ● Đã kết nối
                </span>
                <button
                  onClick={() => onOpenEditModal && onOpenEditModal(cal)}
                  className="text-slate-400 hover:text-indigo-300 bg-slate-800 hover:bg-indigo-600/20 p-1.5 rounded-lg border border-slate-700 hover:border-indigo-500/40 transition"
                  title="Chỉnh sửa cấu hình kết nối này"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteCalendar(cal.id)}
                  className="text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-600/20 p-1.5 rounded-lg border border-slate-700 hover:border-rose-500/40 transition"
                  title="Xóa kết nối Email này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Conflict Report Banner */}
        {syncReport && syncReport.hasConflicts && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-2 mt-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>Phát hiện {syncReport.conflictsCount} Xung Đột Lịch Trình Giữa Các Email:</span>
            </div>

            {syncReport.conflicts.map((c) => (
              <div key={c.id} className="p-2.5 bg-slate-950/80 rounded-lg border border-rose-500/20 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>⏰ Khung giờ trùng: {c.timeSlot}</span>
                  <span className="text-rose-400 font-extrabold">[XUNG ĐỘT CAO]</span>
                </div>
                <div className="text-[11px] text-slate-300">• <strong>{c.accountA}:</strong> {c.eventA}</div>
                <div className="text-[11px] text-slate-300">• <strong>{c.accountB}:</strong> {c.eventB}</div>
                <div className="text-[11px] text-indigo-300 italic pt-1 border-t border-slate-800">
                  💡 Gợi ý từ Thư ký AI: {c.suggestion}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
