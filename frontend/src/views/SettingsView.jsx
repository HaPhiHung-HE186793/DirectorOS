import React, { useState } from 'react';
import { Send, Bell, CheckCircle2, ShieldCheck, HelpCircle, Smartphone, Mail } from 'lucide-react';
import { triggerTelegramTest, triggerEmailTest } from '../services/api';

export default function SettingsView() {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(true);

  const [emailAddress, setEmailAddress] = useState('myhung.dev@example.com');
  const [emailEnabled, setEmailEnabled] = useState(true);

  const [testResult, setTestResult] = useState(null);
  const [emailTestResult, setEmailTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const handleTestNotification = async () => {
    setLoading(true);
    setTestResult(null);
    const res = await triggerTelegramTest("🔔 [myTask Test] Tin nhắn kiểm thử tính năng nhắc việc tự động 21:00 thành công!");
    setTestResult(res);
    setLoading(false);
  };

  const handleTestEmail = async () => {
    setEmailLoading(true);
    setEmailTestResult(null);
    const res = await triggerEmailTest(emailAddress, "📧 [myTask] Kiểm thử thông báo Email 21:00", "Đây là email kiểm thử hệ thống thông báo myTask!");
    setEmailTestResult(res);
    setEmailLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-20 md:pb-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Cấu hình Đa kênh Thông báo & Nhắc việc</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tự động đẩy tin nhắn nhắc nhở việc dở dang & việc sếp giao qua Telegram và Email lúc 21:00 hàng ngày.
        </p>
      </div>

      {/* Telegram Setup Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Telegram Bot Integration</h3>
            <p className="text-xs text-slate-400">Kết nối bot riêng để nhận tin nhắn tức thì</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300">TELEGRAM_BOT_TOKEN</label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="7182910394:AAFx..."
              className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">TELEGRAM_CHAT_ID</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="129038401"
              className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="enableBot"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 border-slate-800 bg-slate-900"
            />
            <label htmlFor="enableBot" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Bật tự động nhắc việc Telegram 21:00 hàng ngày
            </label>
          </div>
        </div>

        {/* Test Trigger Button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleTestNotification}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> {loading ? "Đang gửi..." : "Gửi thử tin nhắn qua Telegram"}
          </button>

          {testResult && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Đã gửi thử nghiệm Telegram!
            </span>
          )}
        </div>
      </div>

      {/* Email Notification Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Email Notification Engine</h3>
            <p className="text-xs text-slate-400">Nhận bản tin tóm tắt công việc qua Email hàng ngày</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300">Địa chỉ Email nhận tin</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="user@example.com"
              className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="enableEmail"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-500 border-slate-800 bg-slate-900"
            />
            <label htmlFor="enableEmail" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Bật tự động gửi Email tóm tắt lúc 21:00
            </label>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleTestEmail}
            disabled={emailLoading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Mail className="w-3.5 h-3.5" /> {emailLoading ? "Đang gửi..." : "Gửi thử Email nhắc nhở"}
          </button>

          {emailTestResult && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Đã gửi thử Email tới {emailTestResult.recipient}!
            </span>
          )}
        </div>
      </div>

      {/* Guide Card */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <HelpCircle className="w-4 h-4 text-indigo-400" /> Hướng dẫn tạo Bot Telegram trong 1 phút:
        </div>
        <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>Mở app Telegram trên điện thoại, tìm bot <code className="text-indigo-300">@BotFather</code>.</li>
          <li>Gửi lệnh <code className="text-indigo-300">/newbot</code> và làm theo hướng dẫn để lấy <strong>Bot Token</strong>.</li>
          <li>Tìm bot <code className="text-indigo-300">@userinfobot</code> gửi nhắn bất kỳ để lấy <strong>Chat ID</strong> của bạn.</li>
          <li>Điền Bot Token và Chat ID vào mẫu trên hoặc file <code className="text-indigo-300">application.yml</code> của backend.</li>
        </ol>
      </div>
    </div>
  );
}
