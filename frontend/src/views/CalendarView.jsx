import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Star, Cake, Flag, Heart } from 'lucide-react';
import { getCalendarGridDays, MONTH_NAMES_VI, WEEKDAY_NAMES_VI, getLunarDateFull } from '../utils/lunarCalendar';
import DayDetailPanel from '../components/calendar/DayDetailPanel';
import AddSpecialDateModal from '../components/calendar/AddSpecialDateModal';

/**
 * Main Perpetual Calendar View — the core page of the app
 * Displays month grid with solar + lunar dates, event indicators
 */
export default function CalendarView({
  calendarData,
  specialDates,
  onMonthChange,
  onCreateSpecialDate,
  onDeleteSpecialDate,
  currentYear,
  currentMonth,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalDate, setAddModalDate] = useState(null);

  // Generate calendar grid
  const gridDays = useMemo(
    () => getCalendarGridDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Build events map from calendarData
  const dayEventsMap = calendarData?.dayEvents || {};

  const handlePrevMonth = () => {
    const newMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const newYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    onMonthChange(newYear, newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const newYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    onMonthChange(newYear, newMonth);
  };

  const handleGoToToday = () => {
    const now = new Date();
    onMonthChange(now.getFullYear(), now.getMonth() + 1);
    setSelectedDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
  };

  const handleDayClick = (dayObj) => {
    setSelectedDate(dayObj.date);
  };

  const handleAddEventOnDate = (dateStr) => {
    setAddModalDate(dateStr);
    setShowAddModal(true);
  };

  const getEventIndicators = (dateStr) => {
    const events = dayEventsMap[dateStr] || [];
    const types = new Set(events.map(e => e.type));
    return {
      hasSpecial: types.has('SPECIAL'),
      hasPlan: types.has('PLAN'),
      hasSynced: types.has('SYNCED'),
      count: events.length,
    };
  };

  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case 'BIRTHDAY': return <Cake className="w-3 h-3" />;
      case 'HOLIDAY': return <Flag className="w-3 h-3" />;
      case 'ANNIVERSARY': return <Heart className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-4 lg:p-5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white">
              {MONTH_NAMES_VI[currentMonth - 1]}, {currentYear}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Lịch Vạn Niên • Dương lịch + Âm lịch
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700/50"
              title="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleGoToToday}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold transition border border-indigo-500/30"
            >
              Hôm nay
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700/50"
              title="Tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => { setAddModalDate(null); setShowAddModal(true); }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition border border-amber-500/30 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thêm ngày đặc biệt</span>
            <span className="sm:hidden text-[11px]">Ngày đặc biệt</span>
          </button>
        </div>
      </div>

      {/* Summary bar */}
      {calendarData && (
        <div className="flex items-center gap-3 sm:gap-4 px-2 text-[11px] sm:text-xs text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            {calendarData.totalSpecialDates || 0} ngày đặc biệt
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            {calendarData.totalPlanItems || 0} kế hoạch
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            {calendarData.totalSyncedEvents || 0} lịch email
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Calendar Grid */}
        <div className="flex-1">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 bg-slate-900/80 border-b border-slate-800/60">
              {WEEKDAY_NAMES_VI.map((day, i) => (
                <div
                  key={day}
                  className={`py-2 text-center text-[11px] sm:text-xs font-bold tracking-wider ${
                    i === 6 ? 'text-rose-400' : 'text-slate-400'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {gridDays.map((dayObj, idx) => {
                const dayEvents = dayEventsMap[dayObj.date] || [];
                const isSelected = selectedDate === dayObj.date;
                const isSunday = idx % 7 === 6;

                return (
                  <button
                    key={dayObj.date}
                    onClick={() => handleDayClick(dayObj)}
                    className={`relative min-h-[70px] sm:min-h-[84px] lg:min-h-[92px] p-1 sm:p-1.5 border-b border-r border-slate-800/40 transition-all duration-150 text-left group flex flex-col justify-between
                      ${!dayObj.isCurrentMonth ? 'opacity-30' : ''}
                      ${dayObj.isToday ? 'bg-indigo-600/15 border-indigo-500/40' : 'hover:bg-slate-800/50'}
                      ${isSelected ? 'bg-amber-500/10 ring-2 ring-amber-500/60 z-10 rounded-lg shadow-lg shadow-amber-500/10' : ''}
                    `}
                  >
                    <div>
                      {/* Top Header: Solar Date & Lunar Date */}
                      <div className="flex items-baseline justify-between gap-1">
                        <div className={`text-sm sm:text-base lg:text-lg font-extrabold leading-none
                          ${dayObj.isToday ? 'text-indigo-300' : isSunday ? 'text-rose-400' : 'text-slate-100'}
                        `}>
                          {dayObj.day}
                        </div>

                        <div className={`text-[9px] sm:text-[10px] leading-none font-medium truncate ${
                          dayObj.isLunarNewMonth ? 'text-amber-400 font-bold' : 'text-slate-500'
                        }`}>
                          {dayObj.isLunarNewMonth ? `${dayObj.lunarDay}/${dayObj.lunarMonth}` : dayObj.lunar}
                        </div>
                      </div>

                      {/* Today indicator dot */}
                      {dayObj.isToday && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      )}
                    </div>

                    {/* Event badge chips (Render title & icon directly on calendar cell) */}
                    {dayObj.isCurrentMonth && dayEvents.length > 0 && (
                      <div className="mt-1 space-y-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev, i) => {
                          if (ev.type === 'SPECIAL') {
                            return (
                              <div
                                key={ev.id || i}
                                className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 truncate flex items-center gap-1 shadow-xs"
                                title={ev.title}
                              >
                                <span className="shrink-0 text-xs">{ev.icon || '📌'}</span>
                                <span className="truncate">{ev.title}</span>
                              </div>
                            );
                          }
                          if (ev.type === 'PLAN') {
                            return (
                              <div
                                key={ev.id || i}
                                className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 truncate flex items-center gap-1 shadow-xs"
                                title={ev.title}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                <span className="truncate">{ev.title}</span>
                              </div>
                            );
                          }
                          if (ev.type === 'SYNCED') {
                            return (
                              <div
                                key={ev.id || i}
                                className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 truncate flex items-center gap-1 shadow-xs"
                                title={ev.title}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                                <span className="truncate">{ev.title}</span>
                              </div>
                            );
                          }
                          return null;
                        })}

                        {dayEvents.length > 2 && (
                          <div className="text-[8px] font-extrabold text-amber-400/90 pl-0.5">
                            +{dayEvents.length - 2} sự kiện khác
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Day Detail Panel (right side on desktop, below on mobile) */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <DayDetailPanel
            selectedDate={selectedDate}
            events={selectedDate ? (dayEventsMap[selectedDate] || []) : []}
            onAddEvent={() => handleAddEventOnDate(selectedDate)}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      </div>

      {/* Add Special Date Modal */}
      {showAddModal && (
        <AddSpecialDateModal
          defaultDate={addModalDate}
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => {
            onCreateSpecialDate(data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
