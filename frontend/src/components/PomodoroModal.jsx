import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Maximize2, Minimize2, X, Bell, CheckCircle2, Clock, Flame } from 'lucide-react';

const TIMER_MODES = {
  WORK: { name: 'Làm việc (Work)', duration: 25 * 60, color: 'from-rose-500 to-amber-500', stroke: '#f43f5e', bgGlow: 'bg-rose-500/10' },
  SHORT_BREAK: { name: 'Nghỉ ngắn (5m)', duration: 5 * 60, color: 'from-emerald-500 to-teal-400', stroke: '#10b981', bgGlow: 'bg-emerald-500/10' },
  LONG_BREAK: { name: 'Nghỉ dài (15m)', duration: 15 * 60, color: 'from-indigo-500 to-cyan-400', stroke: '#6366f1', bgGlow: 'bg-indigo-500/10' },
};

export default function PomodoroModal({ task, onClose, onSessionComplete }) {
  const [mode, setMode] = useState('WORK');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.WORK.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [completedCount, setCompletedCount] = useState(task?.completedPomodoros || 0);

  const timerRef = useRef(null);
  const totalDuration = TIMER_MODES[mode].duration;

  // Play synthesized completion sound via Web Audio API
  const playSoundNotification = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio Context error", e);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const handleComplete = async () => {
    playSoundNotification();
    if (mode === 'WORK') {
      const minutesSpent = Math.round(TIMER_MODES.WORK.duration / 60);
      setCompletedCount(prev => prev + 1);
      if (onSessionComplete && task?.id) {
        await onSessionComplete(task.id, minutesSpent);
      }
      // Suggest short break
      setMode('SHORT_BREAK');
      setTimeLeft(TIMER_MODES.SHORT_BREAK.duration);
    } else {
      setMode('WORK');
      setTimeLeft(TIMER_MODES.WORK.duration);
    }
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[newMode].duration);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[mode].duration);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress percentage for SVG ring
  const strokeDashoffset = 440 - (440 * (totalDuration - timeLeft)) / totalDuration;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isFocusMode ? 'bg-slate-950/95 backdrop-blur-2xl' : 'bg-slate-950/80 backdrop-blur-md'
    }`}>
      {/* Container */}
      <div className={`relative w-full transition-all duration-300 ${
        isFocusMode ? 'max-w-3xl border border-slate-800 p-8 lg:p-12 rounded-3xl bg-slate-900/90 shadow-2xl shadow-rose-500/10' 
                    : 'max-w-lg border border-slate-800/80 p-6 rounded-3xl bg-slate-900/95 shadow-2xl shadow-indigo-500/10'
      }`}>
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 text-rose-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Pomodoro Focus Timer
              </h2>
              <p className="text-xs text-slate-400">
                {task ? task.title : 'Nhiệm vụ tự do'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFocusMode ? "Thoát toàn màn hình" : "Chế độ Tập trung toàn màn hình"}
            >
              {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selectors */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-8">
          {Object.keys(TIMER_MODES).map((key) => {
            const m = TIMER_MODES[key];
            const active = mode === key;
            return (
              <button
                key={key}
                onClick={() => handleSwitchMode(key)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? `bg-gradient-to-r ${m.color} text-white shadow-lg shadow-rose-500/20`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        {/* Circular Progress & Timer */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={TIMER_MODES[mode].stroke}
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-white tracking-tight font-mono drop-shadow-md">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-400 mt-2 font-semibold">
                {TIMER_MODES[mode].name}
              </span>
              <div className="flex items-center space-x-1 text-xs text-rose-400 mt-2 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                <Flame className="w-3.5 h-3.5 fill-rose-500" />
                <span>Phiên đã hoàn thành: {completedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Details Banner if selected */}
        {task && (
          <div className="my-6 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2 truncate">
              <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="truncate font-medium">{task.title}</span>
            </div>
            <span className="text-slate-400 flex-shrink-0 ml-2 font-mono">
              Thực tế: {task.actualMinutes || 0}m / Ước tính: {task.estimatedMinutes || 25}m
            </span>
          </div>
        )}

        {/* Controls Bar */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all transform hover:scale-105"
            title="Đặt lại"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-bold text-white shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2.5 bg-gradient-to-r ${TIMER_MODES[mode].color}`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Bắt đầu</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleComplete()}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all transform hover:scale-105"
            title="Bỏ qua / Hoàn thành phiên"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
