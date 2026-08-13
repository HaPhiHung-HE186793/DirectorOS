import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Crown, Briefcase, AlertTriangle, CheckCircle2, X, ShieldAlert, Zap } from 'lucide-react';

export default function ExecutiveBriefingModal({ briefing, onClose }) {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleVoiceReadout = () => {
    if (!('speechSynthesis' in window)) {
      alert("Trình duyệt không hỗ trợ tổng hợp giọng nói.");
      return;
    }

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    const fullText = `${briefing.greeting}. ${briefing.summaryText}. Lời khuyên từ Thư ký: ${briefing.secretaryAdvice?.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;

    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    setIsPlayingVoice(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!briefing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white shrink-0">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Báo Cáo Thư Ký AI Giám Đốc</h2>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                  EXECUTIVE BRIEFING
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Ngày {briefing.date}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Greeting & Voice Player */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-300">"{briefing.greeting}"</p>
            <p className="text-xs text-slate-300 leading-relaxed">{briefing.summaryText}</p>
          </div>

          <button
            onClick={toggleVoiceReadout}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition active:scale-95 shadow-md ${
              isPlayingVoice
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isPlayingVoice ? (
              <>
                <VolumeX className="w-4 h-4" /> Dừng Đọc
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Nghe Báo Cáo
              </>
            )}
          </button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Tổng công việc</div>
            <div className="text-lg font-extrabold text-white mt-0.5">{briefing.totalTasksCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-xs text-amber-400 font-semibold">Cần Duyệt</div>
            <div className="text-lg font-extrabold text-amber-300 mt-0.5">{briefing.directorDecisionsCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <div className="text-xs text-purple-400 font-semibold">Cuộc Họp</div>
            <div className="text-lg font-extrabold text-purple-300 mt-0.5">{briefing.meetingsCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <div className="text-xs text-rose-400 font-semibold">Xử Lý Gấp</div>
            <div className="text-lg font-extrabold text-rose-300 mt-0.5">{briefing.urgentCount}</div>
          </div>
        </div>

        {/* Secretary Advice List */}
        {briefing.secretaryAdvice && briefing.secretaryAdvice.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Tối Ưu Lịch Trình Từ Thư Ký AI:
            </h4>
            <div className="space-y-1.5">
              {briefing.secretaryAdvice.map((adv, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition"
          >
            Đã Rõ, Tiến Hành Làm Việc
          </button>
        </div>
      </div>
    </div>
  );
}
