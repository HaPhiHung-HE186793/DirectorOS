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
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Mic className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">Giọng Đọc Thư Ký AI (Text-to-Speech Engine)</h3>
          <p className="text-xs text-slate-400">Tùy chọn Ngôn ngữ & Giọng đọc chuẩn Tiếng Việt (Tránh bị ngọng tiếng Anh)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="text-xs font-bold text-amber-300/90 uppercase tracking-wider block mb-1">
            Ngôn ngữ Đọc của AI
          </label>
          <select
            value={aiVoiceLang}
            onChange={(e) => {
              setAiVoiceLang(e.target.value);
              setAiVoiceName('');
            }}
            className="w-full px-3.5 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm min-h-[46px] cursor-pointer"
          >
            {getAvailableLanguages().map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white py-2">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-amber-300/90 uppercase tracking-wider block mb-1">
            Gói Giọng Đọc Hệ Thống
          </label>
          <select
            value={aiVoiceName}
            onChange={(e) => setAiVoiceName(e.target.value)}
            className="w-full px-3.5 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm min-h-[46px] cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-white py-2">-- Tự động chọn giọng đọc chuẩn nhất --</option>
            {filteredVoices.map((v, i) => (
              <option key={i} value={v.name} className="bg-slate-900 text-white py-2">
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Voice Button */}
      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onTestVoice}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
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
