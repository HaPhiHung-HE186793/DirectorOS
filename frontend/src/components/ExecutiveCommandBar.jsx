import React, { useState } from 'react';
import { Sparkles, Mic, MicOff, Send, Crown, Zap } from 'lucide-react';

export default function ExecutiveCommandBar({ onExecuteCommand }) {
  const [command, setCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickPrompts = [
    "Thư ký ơi, 14:00 họp với Giám đốc Tài chính",
    "Nhắc tôi 10:30 duyệt báo cáo ngân sách Q3",
    "Chỉ đạo phòng Nhân sự gửi danh sách ứng viên trước 16:00",
    "Xếp lịch 15:30 tư duy chiến lược sản phẩm mới"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!command.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onExecuteCommand(command.trim());
    setCommand('');
    setIsSubmitting(false);
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ nhận diện giọng nói trực tiếp. Vui lòng gõ lệnh chỉ đạo.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCommand(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
        <Crown className="w-4 h-4 text-amber-400" />
        <span>Chỉ đạo Nhanh Từ Giám Đốc (AI Command Center)</span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Ví dụ: 'Thư ký ơi, 14h họp với VPBank, nhắc duyệt file trước 13h30'..."
            className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all shadow-inner"
          />
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title={isListening ? "Đang lắng nghe Giám đốc..." : "Bật micro chỉ đạo bằng giọng nói"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!command.trim() || isSubmitting}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isSubmitting ? (
            <Sparkles className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Giao Lệnh</span>
            </>
          )}
        </button>
      </form>

      {/* Quick director command chips */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> Mẫu chỉ đạo:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => setCommand(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700/60 text-slate-300 hover:text-amber-300 shrink-0 transition"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
