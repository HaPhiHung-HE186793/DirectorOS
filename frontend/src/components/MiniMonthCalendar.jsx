import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function MiniMonthCalendar({ selectedDate, onSelectDate, tasks = [] }) {
  const [viewDate, setViewDate] = useState(() => selectedDate ? new Date(selectedDate) : new Date());

  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNamesVi = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigation handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleTodayClick = () => {
    const now = new Date();
    setViewDate(now);
    onSelectDate(now);
  };

  // Days calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Grid days generation
  const calendarDays = [];

  // Previous month padded days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, d);
    calendarDays.push({
      dayNumber: d,
      date: prevDate,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, month, d);
    calendarDays.push({
      dayNumber: d,
      date: currDate,
      isCurrentMonth: true
    });
  }

  // Next month padded days to complete 35 or 42 grid cells
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextDate = new Date(year, month + 1, d);
    calendarDays.push({
      dayNumber: d,
      date: nextDate,
      isCurrentMonth: false
    });
  }

  // Helper date comparison
  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 bg-slate-900/90 shadow-xl max-w-sm mx-auto select-none">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-extrabold text-white tracking-tight">
            {monthNamesEn[month]} {year}
          </h3>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {monthNamesVi[month]}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleTodayClick}
            className="px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition mr-1"
          >
            Hôm nay
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={idx} className="text-xs font-bold text-slate-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((item, idx) => {
          const isSelected = isSameDay(item.date, selectedDate);
          const isTodayItem = isSameDay(item.date, today);

          return (
            <div key={idx} className="flex items-center justify-center p-0.5">
              <button
                onClick={() => onSelectDate(item.date)}
                className={`w-9 h-9 text-xs font-semibold rounded-full flex flex-col items-center justify-center transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/40 ring-2 ring-blue-400/50 scale-105'
                    : isTodayItem
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/40 hover:bg-indigo-500/30'
                    : item.isCurrentMonth
                    ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-600 hover:text-slate-400 hover:bg-slate-900/50'
                }`}
              >
                <span>{item.dayNumber}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
