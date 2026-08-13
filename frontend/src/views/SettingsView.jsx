import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  fetchSettings,
  saveSettings,
  triggerTelegramTest,
  triggerEmailTest,
  fetchCalendars,
  addCalendar,
  updateCalendar,
  deleteCalendar,
  syncCalendars
} from '../services/api';
import { getAvailableVoices, getAvailableLanguages, speakText, stopSpeech } from '../utils/speech';

import { TelegramSettingsCard } from '../components/settings/TelegramSettingsCard';
import { EmailNotificationCard } from '../components/settings/EmailNotificationCard';
import { MultiCalendarHubCard } from '../components/settings/MultiCalendarHubCard';
import { VoiceSynthesisCard } from '../components/settings/VoiceSynthesisCard';
import { AddCalendarModal } from '../components/settings/AddCalendarModal';

export const SettingsView = () => {
  // Telegram Settings State
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(true);

  // Email Notification State
  const [emailAddress, setEmailAddress] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(true);

  // Voice TTS Settings State
  const [aiVoiceLang, setAiVoiceLang] = useState('vi-VN');
  const [aiVoiceName, setAiVoiceName] = useState('');
  const [availableSystemVoices, setAvailableSystemVoices] = useState([]);
  const [testingVoice, setTestingVoice] = useState(false);

  // Multi-Email Calendars State
  const [calendars, setCalendars] = useState([]);
  const [showAddCalModal, setShowAddCalModal] = useState(false);
  const [editingCalId, setEditingCalId] = useState(null);
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccType, setNewAccType] = useState('ICAL');
  const [newAccSyncUrl, setNewAccSyncUrl] = useState('');
  const [newAccColor, setNewAccColor] = useState('#3b82f6');
  const [syncingCals, setSyncingCals] = useState(false);
  const [syncReport, setSyncReport] = useState(null);

  // Action Status States
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load available voices
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
      setCalendars(cals || []);
    };

    loadData();
  }, []);

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

  const handleTestTelegramNotification = async () => {
    setLoading(true);
    setTestResult(null);

    const settingsMap = {
      telegram_bot_token: botToken,
      telegram_chat_id: chatId,
      telegram_enabled: String(enabled)
    };
    await saveSettings(settingsMap);

    const res = await triggerTelegramTest("🔔 [DirectorOS Test] Kính chào Giám đốc! Thử nghiệm kết nối Telegram Bot thành công!");
    setTestResult(res);
    setLoading(false);
  };

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState(null);

  const handleTestEmailNotification = async () => {
    setEmailLoading(true);
    setEmailTestResult(null);

    const settingsMap = {
      email_address: emailAddress,
      email_enabled: String(emailEnabled)
    };
    await saveSettings(settingsMap);

    const res = await triggerEmailTest(
      emailAddress,
      "📧 [DirectorOS Test] Bản tin Báo cáo Kế hoạch cho Giám đốc",
      "Kính chào Giám đốc!\n\nĐây là email thử nghiệm định dạng HTML Executive Briefing gửi từ Thư ký AI DirectorOS.\n\nHệ thống Email Engine đã sẵn sàng gửi báo cáo 21:00 hàng ngày cho Giám đốc!"
    );
    setEmailTestResult(res);
    setEmailLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingCalId(null);
    setNewAccName('');
    setNewAccEmail('');
    setNewAccType('ICAL');
    setNewAccSyncUrl('');
    setNewAccColor('#3b82f6');
    setShowAddCalModal(true);
  };

  const handleOpenEditModal = (cal) => {
    setEditingCalId(cal.id);
    setNewAccName(cal.accountName || '');
    setNewAccEmail(cal.emailAddress || '');
    setNewAccType(cal.calendarType || 'ICAL');
    setNewAccSyncUrl(cal.syncUrl || '');
    setNewAccColor(cal.colorTag || '#3b82f6');
    setShowAddCalModal(true);
  };

  const handleSaveCalendarAccount = async (e) => {
    e.preventDefault();
    if (!newAccName || !newAccEmail) return;

    const payload = {
      accountName: newAccName,
      emailAddress: newAccEmail,
      calendarType: newAccType,
      syncUrl: newAccSyncUrl,
      colorTag: newAccColor,
      syncEnabled: true
    };

    if (editingCalId) {
      const updated = await updateCalendar(editingCalId, payload);
      setCalendars(calendars.map(c => (c.id === editingCalId || String(c.id) === String(editingCalId)) ? updated : c));
    } else {
      const newCal = await addCalendar(payload);
      setCalendars([...calendars, newCal]);
    }

    setNewAccName('');
    setNewAccEmail('');
    setNewAccSyncUrl('');
    setEditingCalId(null);
    setShowAddCalModal(false);
  };

  const handleDeleteCalendarAccount = async (id) => {
    await deleteCalendar(id);
    const updated = calendars.filter((c) => c.id !== id);
    setCalendars(updated);
    if (updated.length < 2) {
      setSyncReport(null);
    }
  };

  const handleSyncAndDetectConflicts = async () => {
    setSyncingCals(true);
    const report = await syncCalendars(calendars);
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
      sampleText = "Hello Director, I am your AI Secretary DirectorOS. Ready to assist you!";
    }

    setTestingVoice(true);
    speakText(sampleText, aiVoiceLang, aiVoiceName, () => {
      setTestingVoice(false);
    });
  };

  const filteredVoices = availableSystemVoices.filter(
    (v) => v.lang.startsWith(aiVoiceLang) || v.lang.startsWith(aiVoiceLang.split('-')[0])
  );

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header & Global Save Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Cấu hình Đa Kênh & Quản Lý Đa Email</h2>
          <p className="text-xs text-slate-400 mt-1">
            Đồng bộ nhiều Gmail, phát hiện xung đột lịch trình và tùy chỉnh giọng đọc Thư ký AI.
          </p>
        </div>

        <button
          onClick={handleSaveAllSettings}
          disabled={saving}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Đang Lưu...' : 'Lưu Cấu Hình'}
        </button>
      </div>

      {/* Toast Save Alert */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" /> Đã lưu cài đặt cấu hình hệ thống thành công!
        </div>
      )}

      {/* 1. Telegram Bot Integration Card */}
      <TelegramSettingsCard
        botToken={botToken}
        setBotToken={setBotToken}
        chatId={chatId}
        setChatId={setChatId}
        enabled={enabled}
        setEnabled={setEnabled}
        onTestNotification={handleTestTelegramNotification}
        loading={loading}
        testResult={testResult}
      />

      {/* 2. Email Notification Engine Card */}
      <EmailNotificationCard
        emailAddress={emailAddress}
        setEmailAddress={setEmailAddress}
        emailEnabled={emailEnabled}
        setEmailEnabled={setEmailEnabled}
        onTestEmail={handleTestEmailNotification}
        emailLoading={emailLoading}
        emailTestResult={emailTestResult}
      />

      {/* 2. Multi-Calendar Hub Card */}
      <MultiCalendarHubCard
        calendars={calendars}
        onOpenAddModal={handleOpenAddModal}
        onOpenEditModal={handleOpenEditModal}
        onDeleteCalendar={handleDeleteCalendarAccount}
        onSyncCalendars={handleSyncAndDetectConflicts}
        syncing={syncingCals}
        syncReport={syncReport}
      />

      {/* 3. Voice Synthesis Card */}
      <VoiceSynthesisCard
        aiVoiceLang={aiVoiceLang}
        setAiVoiceLang={setAiVoiceLang}
        aiVoiceName={aiVoiceName}
        setAiVoiceName={setAiVoiceName}
        getAvailableLanguages={getAvailableLanguages}
        filteredVoices={filteredVoices}
        onTestVoice={handleTestVoice}
        testingVoice={testingVoice}
      />

      {/* Add / Edit Calendar Modal */}
      <AddCalendarModal
        show={showAddCalModal}
        isEditing={!!editingCalId}
        onClose={() => {
          setShowAddCalModal(false);
          setEditingCalId(null);
        }}
        onSubmit={handleSaveCalendarAccount}
        newAccName={newAccName}
        setNewAccName={setNewAccName}
        newAccEmail={newAccEmail}
        setNewAccEmail={setNewAccEmail}
        newAccType={newAccType}
        setNewAccType={setNewAccType}
        newAccSyncUrl={newAccSyncUrl}
        setNewAccSyncUrl={setNewAccSyncUrl}
        newAccColor={newAccColor}
        setNewAccColor={setNewAccColor}
      />
    </div>
  );
};


export default SettingsView;
