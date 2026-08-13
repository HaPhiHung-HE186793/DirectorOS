import React from 'react';
import { Plus, Lock } from 'lucide-react';

export const AddCalendarModal = ({
  show,
  onClose,
  onSubmit,
  newAccName,
  setNewAccName,
  newAccEmail,
  setNewAccEmail,
  newAccType,
  setNewAccType,
  newAccSyncUrl,
  setNewAccSyncUrl,
  newAccColor,
  setNewAccColor
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl space-y-4">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" /> Kết Nối Tài Khoản Email / Lịch Mới
        </h3>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Tên gợi nhớ tài khoản</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Gmail Công Ty A, Gmail Dự Án..."
              value={newAccName}
              onChange={(e) => setNewAccName(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Địa chỉ Email</label>
            <input
              type="email"
              required
              placeholder="director@company.com"
              value={newAccEmail}
              onChange={(e) => setNewAccEmail(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Phương Thức Xác Thực Lịch (Enterprise Auth)</label>
            <select
              value={newAccType}
              onChange={(e) => setNewAccType(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ICAL">🔗 Secret iCal / ICS Private Feed URL (Nhanh & Bảo mật)</option>
              <option value="GMAIL">🔐 Google OAuth2 (Ủy quyền Google Calendar API v3)</option>
              <option value="OUTLOOK">🔐 Microsoft OAuth2 (Ủy quyền MS Graph API v1.0)</option>
            </select>
          </div>

          {newAccType === 'ICAL' ? (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Đường dẫn Lịch Bí Mật (Secret iCal URL)</label>
                <span className="text-[10px] text-amber-400 font-mono">Bắt buộc xác thực</span>
              </div>
              <input
                type="url"
                required
                placeholder="https://calendar.google.com/calendar/ical/.../private-xxxx/basic.ics"
                value={newAccSyncUrl}
                onChange={(e) => setNewAccSyncUrl(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                * Lấy tại: Google Calendar Settings ➔ Integrate calendar ➔ Secret address in iCal format.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2">
              <p className="text-[11px] text-indigo-200">
                Cần ủy quyền OAuth2 để cấp quyền <code className="text-emerald-300">calendar.readonly</code> cho DirectorOS.
              </p>
              <button
                type="button"
                onClick={() => alert(`Khởi tạo luồng OAuth2 Redirect tới ${newAccType === 'GMAIL' ? 'Google Cloud IAM' : 'Microsoft Azure AD'}...`)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" /> Ủy Quyền {newAccType === 'GMAIL' ? 'Google' : 'Microsoft'} OAuth2
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Màu Nhận Diện Lịch</label>
              <input
                type="color"
                value={newAccColor}
                onChange={(e) => setNewAccColor(e.target.value)}
                className="w-full mt-1 h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
              />
            </div>
            <div className="flex items-end">
              <span className="text-[11px] text-slate-400 pb-2">Mã màu hiển thị trùng lịch</span>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Kết Nối Lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
