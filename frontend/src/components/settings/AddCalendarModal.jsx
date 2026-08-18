import React from 'react';
import { Plus, Pencil, Lock } from 'lucide-react';
import { FormLabel, FormInput, FormSelect } from './FormControls';

export const AddCalendarModal = ({
  show,
  onClose,
  onSubmit,
  isEditing = false,
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
          {isEditing ? (
            <>
              <Pencil className="w-4 h-4 text-indigo-400" /> Chỉnh Sửa Kết Nối Email / Lịch
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-emerald-400" /> Kết Nối Tài Khoản Email / Lịch Mới
            </>
          )}
        </h3>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <FormLabel>Tên gợi nhớ tài khoản</FormLabel>
            <FormInput
              type="text"
              required
              placeholder="Ví dụ: Gmail Công Ty A, Gmail Dự Án..."
              value={newAccName}
              onChange={(e) => setNewAccName(e.target.value)}
            />
          </div>

          <div>
            <FormLabel>Địa chỉ Email</FormLabel>
            <FormInput
              type="email"
              required
              placeholder="director@company.com"
              value={newAccEmail}
              onChange={(e) => setNewAccEmail(e.target.value)}
            />
          </div>

          <div>
            <FormLabel>Phương Thức Xác Thực Lịch (Enterprise Auth)</FormLabel>
            <FormSelect
              value={newAccType}
              onChange={(e) => setNewAccType(e.target.value)}
            >
              <option value="ICAL">🔗 Link iCal Bí Mật (.ics) hoặc Link Chia Sẻ Google Calendar (cid=... / Shareable Link)</option>
              <option value="GMAIL">🔐 Google OAuth2 (Google Calendar API v3)</option>
              <option value="OUTLOOK">🔐 Microsoft OAuth2 (MS Graph API v1.0)</option>
            </FormSelect>
          </div>

          {newAccType === 'ICAL' ? (
            <div>
              <FormLabel extraRight={<span className="text-[10px] text-amber-400 font-mono font-bold">Bắt buộc</span>}>
                Link Lịch iCal / Link Chia Sẻ Google Calendar
              </FormLabel>
              <FormInput
                type="text"
                required
                fontMono
                placeholder="Dán Link chia sẻ Google Calendar (cid=...) hoặc Link Secret iCal (.ics)..."
                value={newAccSyncUrl}
                onChange={(e) => setNewAccSyncUrl(e.target.value)}
                className="text-emerald-400 focus:border-emerald-500 text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                * Hỗ trợ 2 cách lấy link:<br/>
                • <b>Cách 1 (Link Chia Sẻ):</b> Google Calendar ➔ Quyền truy cập ➔ <code className="text-indigo-300">Lấy liên kết có thể chia sẻ (Get shareable link)</code><br/>
                • <b>Cách 2 (Link Bí Mật):</b> Google Calendar ➔ Tích hợp lịch ➔ <code className="text-emerald-300">Địa chỉ mật ở định dạng iCal (Secret address in iCal)</code>
              </p>
            </div>
          ) : (
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2">
              <p className="text-[11px] text-indigo-200">
                Cần ủy quyền OAuth2 để cấp quyền <code className="text-emerald-300">calendar.readonly</code> cho DirectorOS.
              </p>
              <button
                type="button"
                onClick={async () => {
                  const endpoint = newAccType === 'GMAIL' ? '/api/auth/google/url' : '/api/auth/microsoft/url';
                  try {
                    const res = await fetch(endpoint);
                    if (res.ok) {
                      const data = await res.json();
                      if (data.authUrl) {
                        window.location.href = data.authUrl;
                        return;
                      }
                    }
                  } catch (e) {}
                  alert(`Khởi tạo luồng OAuth2 Redirect tới ${newAccType === 'GMAIL' ? 'Google Cloud IAM' : 'Microsoft Azure AD'}...`);
                }}
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
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              {isEditing ? 'Lưu Thay Đổi' : 'Kết Nối Lịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
