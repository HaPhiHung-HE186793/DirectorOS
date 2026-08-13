import React from 'react';
import { FileText, Users, HelpCircle, CheckCircle2, X, Target, Printer, Sparkles } from 'lucide-react';

export default function ExecutiveMeetingDossierModal({ dossier, onClose }) {
  if (!dossier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hồ Sơ Cuộc Họp 1-Trang
                </span>
                <span className="text-xs text-slate-400 font-semibold">{dossier.scheduledTime}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">{dossier.meetingTitle}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Primary Objective */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <h3 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-400" /> Mục tiêu chính cuộc họp
            </h3>
            <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
              {dossier.primaryObjective}
            </p>
          </div>

          {/* Key Context & History */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Bối cảnh & Dữ liệu cần lưu ý
            </h3>
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
              {dossier.keyContextPoints?.map((item, idx) => (
                <div key={idx} className="leading-relaxed font-normal">{item}</div>
              ))}
            </div>
          </div>

          {/* Strategic Questions for Director */}
          <div>
            <h3 className="text-xs font-bold uppercase text-amber-300 flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Câu hỏi chiến lược Giám đốc nên đặt ra
            </h3>
            <div className="space-y-2">
              {dossier.strategicQuestions?.map((q, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs font-medium text-amber-100 flex items-start gap-2">
                  <span className="shrink-0 font-bold text-amber-400">❖</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attendees */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-indigo-400" /> Thành phần tham dự
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {dossier.keyAttendees?.map((person, idx) => (
                <div key={idx} className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-200 font-medium">
                  {person}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Outcome */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-400 mb-0.5">Kết quả kỳ vọng (Recommended Outcome):</span>
              {dossier.recommendedOutcome}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> In Hồ Sơ
          </button>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-md"
          >
            Đã Nắm Rõ Hồ Sơ
          </button>
        </div>
      </div>
    </div>
  );
}
