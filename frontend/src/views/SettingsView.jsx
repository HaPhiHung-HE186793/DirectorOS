import React, { useState, useEffect } from 'react';
import { Send, Bell, CheckCircle2, ShieldCheck, HelpCircle, Smartphone, Mail, Save, Volume2, VolumeX, Mic } from 'lucide-react';
import { triggerTelegramTest, triggerEmailTest, fetchSettings, saveSettings } from '../services/api';
import { getAvailableLanguages, getAvailableVoices, speakText, stopSpeech } from '../utils/speech';

export default function SettingsView() {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(true);

  const [emailAddress, setEmailAddress] = useState('myhung.dev@example.com');
  const [emailEnabled, setEmailEnabled] = useState(true);

  // AI Voice states
  const [aiVoiceLang, setAiVoiceLang] = useState('vi-VN');
  const [aiVoiceName, setAiVoiceName] = useState('');
  const [availableSystemVoices, setAvailableSystemVoices] = useState([]);
  const [testingVoice, setTestingVoice] = useState(false);

  const [testResult, setTestResult] = useState(null);
  const [emailTestResult, setEmailTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load voices
    const updateVoices = () => {
      const voices = getAvailableVoices();
      setAvailableSystemVoices(voices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Load saved settings
    const loadSystemSettings = async () => {
      const data = await fetchSettings();
      if (data.telegram_bot_token) setBotToken(data.telegram_bot_token);
      if (data.telegram_chat_id) setChatId(data.telegram_chat_id);
      if (data.telegram_enabled !== undefined) setEnabled(data.telegram_enabled === 'true');
      if (data.email_address) setEmailAddress(data.email_address);
      if (data.email_enabled !== undefined) setEmailEnabled(data.email_enabled === 'true');
      if (data.ai_voice_lang) setAiVoiceLang(data.ai_voice_lang);
      if (data.ai_voice_name) setAiVoiceName(data.ai_voice_name);
    };
    loadSystemSettings();

    return () => {
      stopSpeech();
    };
  }, []);

  const filteredVoices = availableSystemVoices.filter(v => {
    if (!aiVoiceLang) return true;
    const cleanLang = aiVoiceLang.toLowerCase().replace('_', '-');
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang === cleanLang || vLang.startsWith(cleanLang.split('-')[0]);
  });

  const handleSaveAllSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    const settingsMap = {
      telegram_bot_token: botToken,
      telegram_chat_id: chatId,
      telegram_enabled: String(enabled),
      email_address: emailAddress,
      email_enabled: String(emailEnabled),
      ai_voice_lang: aiVoiceLang,
      ai_voice_name: aiVoiceName
    };
    await saveSettings(settingsMap);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestVoice = () => {
    if (testingVoice) {
      stopSpeech();
      setTestingVoice(false);
      return;
    }

    let sampleText = "Kính chào Giám đốc, tôi là Thư ký AI DirectorOS. Rất hân hạnh được báo cáo và hỗ trợ Giám đốc hôm nay!";
    if (aiVoiceLang.startsWith('en')) {
      sampleText = "Hello Director, I am your AI Secretary DirectorOS. I am ready to assist you today!";
    } else if (aiVoiceLang.startsWith('ja')) {
      sampleText = "社長、こんにちは。DirectorOS AI 秘書でございます。";
    }

    setTestingVoice(true);
    speakText(sampleText, {
      lang: aiVoiceLang,
      voiceName: aiVoiceName,
      onEnd: () => setTestingVoice(false),
      onError: () => setTestingVoice(false)
    });
  };

  const handleTestNotification = async () => {
    setLoading(true);
    setTestResult(null);
    const res = await triggerTelegramTest("🔔 [DirectorOS Test] Tin nhắn kiểm thử tính năng nhắc việc Thư ký AI thành công!");
    setTestResult(res);
    setLoading(false);
  };

  const handleTestEmail = async () => {
    setEmailLoading(true);
    setEmailTestResult(null);
    const res = await triggerEmailTest(emailAddress, "📧 [DirectorOS] Kiểm thử thông báo Email", "Đây là email kiểm thử hệ thống thông báo DirectorOS!");
    setEmailTestResult(res);
    setEmailLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Cấu hình Đa kênh Thông báo & Giọng nói AI</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tự động đẩy tin nhắn nhắc nhở và tùy chỉnh giọng đọc chuẩn cho Thư ký AI.
          </p>
        </div>

        <button
          onClick={handleSaveAllSettings}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? "Đang lưu..." : "Lưu Cấu Hình"}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Đã lưu cài đặt cấu hình hệ thống thành công!
        </div>
      )}

      {/* AI Voice Configuration Card */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-slate-900/90 space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Giọng Đọc Thư Ký AI (Text-to-Speech Engine)</h3>
            <p className="text-xs text-slate-400">Tùy chọn Ngôn ngữ & Giọng đọc chuẩn Tiếng Việt (Tránh bị ngọng tiếng Anh)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300">Ngôn ngữ Đọc của AI</label>
            <select
              value={aiVoiceLang}
              onChange={(e) => {
                setAiVoiceLang(e.target.value);
                setAiVoiceName('');
              }}
              className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {getAvailableLanguages().map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Gói Giọng Đọc Hệ Thống</label>
            <select
              value={aiVoiceName}
              onChange={(e) => setAiVoiceName(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Tự động chọn giọng chuẩn nhất ({aiVoiceLang}) --</option>
              {filteredVoices.map((v, i) => (
                <option key={i} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Test Voice Button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleTestVoice}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition active:scale-95 shadow-md ${
              testingVoice
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
            }`}
          >
            {testingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {testingVoice ? "Dừng Đọc Thử" : "Nghe Thử Giọng Thư Ký AI"}
          </button>

          <span className="text-[11px] text-slate-400">
            {filteredVoices.length > 0
              ? `Đã phát hiện ${filteredVoices.length} giọng đọc thích hợp trên thiết bị.`
              : 'Trình duyệt sẽ tự động điều chỉnh giọng đọc tối ưu.'}
          </span>
        </div>
      </div>

      {/* Telegram Setup Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
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
              className="w-4 h-4 rounded text-sky-500 border-slate-800 bg-slate-900 cursor-pointer"
            />
            <label htmlFor="enableBot" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Bật tự động nhắc việc Telegram 07:00 & 21:00 hàng ngày
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
              <CheckCircle2 className="w-4 h-4" /> Đã thử nghiệm Telegram! ({testResult.sent ? "Thành công" : "Mô phỏng"})
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
              className="w-4 h-4 rounded text-indigo-500 border-slate-800 bg-slate-900 cursor-pointer"
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
    </div>
  );
}
