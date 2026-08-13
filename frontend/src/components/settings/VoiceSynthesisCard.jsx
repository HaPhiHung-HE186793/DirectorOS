import React from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';

export const VoiceSynthesisCard = ({
  aiVoiceLang,
  setAiVoiceLang,
  aiVoiceName,
  setAiVoiceName,
  getAvailableLanguages,
  filteredVoices,
  onTestVoice,
  testingVoice
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
          <Mic className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">Giọng Đọc Thư Ký AI (Text-to-Speech Engine)</h3>
          <p className="text-xs text-slate-400">Tùy chọn Ngôn ngữ & Giọng đọc chuẩn Tiếng Việt (Tránh bị ngọng tiếng Anh)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <label className="text-xs font-semibold text-slate-300">Ngôn ngữ Đọc của AI</label>
          <select
            value={aiVoiceLang}
            onChange={(e) => {
              setAiVoiceLang(e.target.value);
              setAiVoiceName('');
            }}
            className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
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
            className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
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
          onClick={onTestVoice}
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
  );
};
