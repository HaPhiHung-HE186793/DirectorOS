import React from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const EmailNotificationCard = ({
  emailAddress,
  setEmailAddress,
  emailEnabled,
  setEmailEnabled,
  onTestEmail,
  emailLoading,
  emailTestResult
}) => {
  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">Email Notification Engine (HTML Executive Briefing)</h3>
          <p className="text-xs text-slate-400">Tự động gửi email tóm tắt công việc định kỳ qua máy chủ SMTP</p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div>
          <label className="text-xs font-semibold text-slate-300">Địa chỉ Email nhận tin</label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="director@company.com"
            className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="enableEmailNotification"
            checked={emailEnabled}
            onChange={(e) => setEmailEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-500 border-slate-800 bg-slate-900 cursor-pointer shrink-0"
          />
          <label htmlFor="enableEmailNotification" className="text-xs font-semibold text-slate-300 cursor-pointer">
            Bật tự động gửi Email báo cáo tóm tắt lúc 21:00 hàng ngày
          </label>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={onTestEmail}
            disabled={emailLoading}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            {emailLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {emailLoading ? 'Đang gửi...' : 'Gửi Thử Email Tóm Tắt (HTML)'}
          </button>

          {emailTestResult && (
            <div className={`text-xs flex items-center gap-1.5 font-semibold ${emailTestResult.sent ? 'text-emerald-400' : 'text-rose-400'}`}>
              {emailTestResult.sent ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{emailTestResult.sent ? `Đã gửi thử tới ${emailTestResult.recipient}!` : 'Chưa gửi được (Kiểm tra SMTP)'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
