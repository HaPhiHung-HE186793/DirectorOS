import React, { useState, useEffect } from 'react';
import { Send, Bell, CheckCircle2, ShieldCheck, HelpCircle, Smartphone, Mail, Save, Volume2, VolumeX, Mic, Calendar, Plus, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { triggerTelegramTest, triggerEmailTest, fetchSettings, saveSettings, fetchCalendars, addCalendar, deleteCalendar, syncCalendars } from '../services/api';
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

  // Multi-Email Calendars state
  const [calendars, setCalendars] = useState([]);
  const [showAddCalModal, setShowAddCalModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccType, setNewAccType] = useState('GMAIL');
  const [newAccColor, setNewAccColor] = useState('#3b82f6');
  const [syncingCals, setSyncingCals] = useState(false);
  const [syncReport, setSyncReport] = useState(null);

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

    // Load saved settings & connected calendars
    const loadData = async () => {
      const data = await fetchSettings();
      if (data.telegram_bot_token) setBotToken(data.telegram_bot_token);
      if (data.telegram_chat_id) setChatId(data.telegram_chat_id);
      if (data.telegram_enabled !== undefined) setEnabled(data.telegram_enabled === 'true');
      if (data.email_address) setEmailAddress(data.email_address);
      if (data.email_enabled !== undefined) setEmailEnabled(data.email_enabled === 'true');
      if (data.ai_voice_lang) setAiVoiceLang(data.ai_voice_lang);
      if (data.ai_voice_name) setAiVoiceName(data.ai_voice_name);

      const cals = await fetchCalendars();
      setCalendars(cals);
    };
    loadData();

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

  const handleAddCalendarAccount = async (e) => {
    e.preventDefault();
    if (!newAccName || !newAccEmail) return;

    const newCal = await addCalendar({
      accountName: newAccName,
      emailAddress: newAccEmail,
      calendarType: newAccType,
      colorTag: newAccColor,
      syncEnabled: true
    });

    setCalendars([...calendars, newCal]);
    setNewAccName('');
    setNewAccEmail('');
    setShowAddCalModal(false);
  };

  const handleDeleteCalendarAccount = async (id) => {
    await deleteCalendar(id);
    setCalendars(calendars.filter(c => c.id !== id));
  };

  const handleSyncAndDetectConflicts = async () => {
    setSyncingCals(true);
    const report = await syncCalendars();
    setSyncReport(report);
    setSyncingCals(false);
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
          <h2 className="text-xl font-extrabold text-white">Cấu hình Đa Kênh & Quản Lý Đa Email</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Đồng bộ nhiều Gmail, phát hiện xung đột lịch trình và tùy chỉnh giọng đọc Thư ký AI.
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

      {/* Multi-Account Email & Calendar Synchronization Card */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-slate-900/90 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Trung Tâm Kết Nối Đa Email & Lịch Trình</h3>
              <p className="text-xs text-slate-400">Kết nối nhiều tài khoản Gmail/Google Calendar để tự động phát hiện xung đột lịch</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAndDetectConflicts}
              disabled={syncingCals}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingCals ? 'animate-spin' : ''}`} />
              {syncingCals ? 'Đang quét...' : 'Đồng Bộ & Quét Trùng Lịch'}
            </button>

            <button
              onClick={() => setShowAddCalModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" /> Thêm Email
            </button>
          </div>
        </div>

        {/* Connected Email Accounts List */}
        <div className="space-y-2 pt-2">
          {calendars.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
              Chưa có tài khoản Email nào được kết nối. Bấm <strong>+ Thêm Email</strong> để bắt đầu tổng hợp lịch trình đa công ty!
            </div>
          ) : (
            calendars.map((cal) => (
              <div key={cal.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cal.colorTag || '#3b82f6' }} />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {cal.accountName}
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
                        {cal.calendarType || 'GMAIL'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{cal.emailAddress}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    🟢 Đã kết nối
                  </span>
                  <button
                    onClick={() => handleDeleteCalendarAccount(cal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Conflict Report Warning Card */}
        {syncReport && syncReport.hasConflicts && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
              Phát hiện {syncReport.conflictsCount} Xung Đột Lịch Trình Giữa Các Email:
            </div>
            {syncReport.conflicts.map((c, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950/80 border border-rose-500/20 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between font-bold text-amber-400">
                  <span>⏰ Khung giờ trùng: {c.timeSlot}</span>
                  <span className="text-rose-400 font-extrabold">[XUNG ĐỘT CAO]</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  • <strong>{c.accountA}:</strong> {c.eventA}
                </div>
                <div className="text-[11px] text-slate-300">
                  • <strong>{c.accountB}:</strong> {c.eventB}
                </div>
                <div className="text-[11px] text-indigo-300 italic pt-1 border-t border-slate-800">
                  💡 Gợi ý từ Thư ký AI: {c.suggestion}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Calendar Modal */}
      {showAddCalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Kết Nối Tài Khoản Email / Lịch Mới
            </h3>

            <form onSubmit={handleAddCalendarAccount} className="space-y-3">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Nguồn Lịch</label>
                  <select
                    value={newAccType}
                    onChange={(e) => setNewAccType(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="GMAIL">Google / Gmail Calendar</option>
                    <option value="OUTLOOK">Microsoft Outlook</option>
                    <option value="ICAL">iCal / ICS Feed URL</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Màu Nhận Diện</label>
                  <input
                    type="color"
                    value={newAccColor}
                    onChange={(e) => setNewAccColor(e.target.value)}
                    className="w-full mt-1 h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCalModal(false)}
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
