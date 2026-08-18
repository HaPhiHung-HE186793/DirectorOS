import React, { useState } from 'react';
import { Send, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const TelegramSettingsCard = ({
  botToken,
  setBotToken,
  chatId,
  setChatId,
  enabled,
  setEnabled,
  onTestNotification,
  loading,
  testResult
}) => {
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
          <Send className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">Telegram Bot Integration</h3>
          <p className="text-xs text-slate-400">Tùy chỉnh Token & Chat ID trực tiếp không cần khởi động lại server</p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div>
          <label className="text-xs font-semibold text-slate-300">TELEGRAM_BOT_TOKEN</label>
          <div className="relative mt-1">
            <input
              type={showToken ? 'text' : 'password'}
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Ví dụ: 8824714561:AAEBr..."
              autoComplete="off"
              className="w-full p-2.5 pr-10 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              title={showToken ? 'Ẩn Token' : 'Hiện Token'}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">TELEGRAM_CHAT_ID</label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="Ví dụ: 5304032224"
            className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="enableTelegram"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-sky-500 border-slate-800 bg-slate-900 cursor-pointer shrink-0"
          />
          <label htmlFor="enableTelegram" className="text-xs font-semibold text-slate-300 cursor-pointer">
            Bật tự động nhắc việc Telegram 07:00 & 21:00 hàng ngày
          </label>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={onTestNotification}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Đang lưu & gửi...' : 'Gửi thử tin nhắn qua Telegram'}
          </button>

          {testResult && (
            <div className={`text-xs flex items-center gap-1.5 font-semibold ${testResult.sent ? 'text-emerald-400' : 'text-rose-400'}`}>
              {testResult.sent ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{testResult.sent ? 'Gửi Telegram thành công!' : 'Chưa gửi được (Kiểm tra Token/Bot)'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
