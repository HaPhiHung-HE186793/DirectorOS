import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Star, Cake, Flag, Heart, X } from 'lucide-react';
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
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Generate calendar grid
  const gridDays = useMemo(
    () => getCalendarGridDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Auto-sync selectedDate to current month when changing months
  React.useEffect(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const selY = parseInt(parts[0], 10);
        const selM = parseInt(parts[1], 10);
        if (selY !== currentYear || selM !== currentMonth) {
          if (now.getFullYear() === currentYear && (now.getMonth() + 1) === currentMonth) {
            setSelectedDate(todayStr);
          } else {
            setSelectedDate(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`);
          }
        }
      }
    } else {
      if (now.getFullYear() === currentYear && (now.getMonth() + 1) === currentMonth) {
        setSelectedDate(todayStr);
      } else {
        setSelectedDate(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`);
      }
    }
  }, [currentYear, currentMonth]);

  // Build aggregated events map (Instant local render + backend merge, zero delay)
  const dayEventsMap = useMemo(() => {
    const map = {};

    // 1. Immediately map all specialDates from props for currentYear & currentMonth (<1ms)
    if (Array.isArray(specialDates)) {
      specialDates.forEach((sd) => {
        if (!sd.eventDate) return;
        const dateStr = typeof sd.eventDate === 'string' ? sd.eventDate : '';
        const parts = dateStr.split('-');
        if (parts.length < 3) return;
        const sdMonth = parseInt(parts[1], 10);
        const sdDay = parseInt(parts[2], 10);

        if (sdMonth === currentMonth) {
          const fullDate = `${currentYear}-${String(sdMonth).padStart(2, '0')}-${String(sdDay).padStart(2, '0')}`;
          if (!map[fullDate]) map[fullDate] = [];
          map[fullDate].push({
            id: `special-${sd.id}`,
            specialDateId: sd.id,
            date: fullDate,
            title: sd.title,
            type: 'SPECIAL',
            eventType: sd.eventType,
            color: sd.color,
            icon: sd.icon,
            note: sd.note,
          });
        }
      });
    }

    // 2. Merge backend calendarData if it matches currentYear & currentMonth
    if (calendarData && calendarData.year === currentYear && calendarData.month === currentMonth && calendarData.dayEvents) {
      Object.entries(calendarData.dayEvents).forEach(([dateKey, events]) => {
        if (!map[dateKey]) map[dateKey] = [];
        events.forEach((ev) => {
          if (ev.type === 'SPECIAL') {
            const exists = map[dateKey].some((e) =>
              e.type === 'SPECIAL' && (
                (e.specialDateId && ev.specialDateId && e.specialDateId === ev.specialDateId) ||
                (e.id && ev.id && e.id === ev.id) ||
                (e.title && ev.title && e.title.trim().toLowerCase() === ev.title.trim().toLowerCase())
              )
            );
            if (!exists) map[dateKey].push(ev);
          } else {
            map[dateKey].push(ev);
          }
        });
      });
    }

    return map;
  }, [currentYear, currentMonth, specialDates, calendarData]);

  // Compute total counts for summary bar dynamically
  const totals = useMemo(() => {
    let specialCount = 0;
    let planCount = 0;
    let syncedCount = 0;
    Object.values(dayEventsMap).forEach((events) => {
      events.forEach((ev) => {
        if (ev.type === 'SPECIAL') specialCount++;
        else if (ev.type === 'PLAN') planCount++;
        else if (ev.type === 'SYNCED') syncedCount++;
      });
    });
    return { specialCount, planCount, syncedCount };
  }, [dayEventsMap]);

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
    setShowMobileDetail(true);
  };

  const handleAddEventOnDate = (dateStr) => {
    setAddModalDate(dateStr);
    setShowAddModal(true);
  };

  // Compute grid rows for dynamic mobile flex height (5 or 6 rows)
  const numRows = Math.ceil(gridDays.length / 7);
  const gridRowsClass = numRows === 6 ? 'grid-rows-6' : 'grid-rows-5';

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full lg:h-auto space-y-1.5 sm:space-y-2 lg:space-y-4 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-2.5 sm:p-4 lg:p-5 rounded-2xl border border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white">
              {MONTH_NAMES_VI[currentMonth - 1]}, {currentYear}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
              Lịch Vạn Niên • Dương lịch + Âm lịch
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700/50"
              title="Tháng trước"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleGoToToday}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[11px] sm:text-xs font-bold transition border border-indigo-500/30"
            >
              Hôm nay
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700/50"
              title="Tháng sau"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
          <button
            onClick={() => { setAddModalDate(null); setShowAddModal(true); }}
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-bold transition border border-amber-500/30 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thêm ngày đặc biệt</span>
            <span className="sm:hidden text-[10px]">Ngày đặc biệt</span>
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 px-3 py-1.5 bg-slate-900/60 rounded-xl border border-slate-800/60 text-[10px] sm:text-xs text-slate-300 shrink-0">
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          {totals.specialCount} <span className="hidden xs:inline">ngày đặc biệt</span><span className="xs:hidden">đặc biệt</span>
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          {totals.planCount} kế hoạch
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          {totals.syncedCount} <span className="hidden xs:inline">lịch email</span><span className="xs:hidden">email</span>
        </span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-4 overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0 h-full">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl flex-1 min-h-0 flex flex-col">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 bg-slate-900/90 border-b border-slate-800/60 shrink-0">
              {WEEKDAY_NAMES_VI.map((day, i) => (
                <div
                  key={day}
                  className={`py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-extrabold tracking-wider ${
                    i === 6 ? 'text-rose-400' : 'text-slate-400'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid (Dynamically stretched flex rows on mobile) */}
            <div className={`grid grid-cols-7 ${gridRowsClass} flex-1 min-h-0 divide-y divide-x divide-slate-800/40 h-full`}>
              {gridDays.map((dayObj, idx) => {
                const dayEvents = dayEventsMap[dayObj.date] || [];
                const isSelected = selectedDate === dayObj.date;
                const isSunday = idx % 7 === 6;

                return (
                  <button
                    key={dayObj.date}
                    onClick={() => handleDayClick(dayObj)}
                    className={`relative h-full min-h-0 p-1 sm:p-1.5 transition-all duration-150 text-left group flex flex-col justify-between overflow-hidden max-w-full min-w-0
                      ${!dayObj.isCurrentMonth ? 'opacity-25' : ''}
                      ${dayObj.isToday ? 'bg-indigo-600/15 border-indigo-500/40' : 'hover:bg-slate-800/50'}
                      ${isSelected ? 'bg-amber-500/10 ring-2 ring-amber-500/60 z-10 rounded-lg shadow-lg shadow-amber-500/10' : ''}
                    `}
                  >
                    <div className="w-full min-w-0 overflow-hidden">
                      {/* Top Header: Solar Date & Lunar Date */}
                      <div className="flex items-baseline justify-between gap-0.5 w-full min-w-0">
                        <div className={`text-xs sm:text-base lg:text-lg font-extrabold leading-none shrink-0
                          ${dayObj.isToday ? 'text-indigo-300' : isSunday ? 'text-rose-400' : 'text-slate-100'}
                        `}>
                          {dayObj.day}
                        </div>

                        <div className={`text-[8px] sm:text-[10px] leading-none font-medium truncate min-w-0 ${
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

                    {/* Event badge chips */}
                    {dayObj.isCurrentMonth && dayEvents.length > 0 && (
                      <div className="mt-0.5 space-y-0.5 w-full max-w-full min-w-0 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev, i) => {
                          if (ev.type === 'SPECIAL') {
                            const isBirthday = ev.eventType === 'BIRTHDAY';
                            const isHoliday = ev.eventType === 'HOLIDAY';
                            const chipStyle = isBirthday
                              ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                              : isHoliday
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

                            return (
                              <div
                                key={ev.id || i}
                                className={`px-1 py-[1px] rounded text-[8px] sm:text-[10px] font-extrabold border leading-tight truncate flex items-center gap-0.5 shadow-xs w-full max-w-full min-w-0 overflow-hidden ${chipStyle}`}
                                title={ev.title}
                              >
                                <span className="shrink-0 text-[9px] sm:text-xs">{ev.icon || (isBirthday ? '🎂' : '📌')}</span>
                                <span className="truncate min-w-0 flex-1">{ev.title}</span>
                              </div>
                            );
                          }
                          if (ev.type === 'PLAN') {
                            return (
                              <div
                                key={ev.id || i}
                                className="px-1 py-[1px] rounded text-[8px] sm:text-[10px] font-bold leading-tight bg-blue-500/20 text-blue-300 border border-blue-500/40 truncate flex items-center gap-0.5 shadow-xs w-full max-w-full min-w-0 overflow-hidden"
                                title={ev.title}
                              >
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400 shrink-0" />
                                <span className="truncate min-w-0 flex-1">{ev.title}</span>
                              </div>
                            );
                          }
                          if (ev.type === 'SYNCED') {
                            return (
                              <div
                                key={ev.id || i}
                                className="px-1 py-[1px] rounded text-[8px] sm:text-[10px] font-bold leading-tight bg-purple-500/20 text-purple-300 border border-purple-500/40 truncate flex items-center gap-0.5 shadow-xs w-full max-w-full min-w-0 overflow-hidden"
                                title={ev.title}
                              >
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400 shrink-0" />
                                <span className="truncate min-w-0 flex-1">{ev.title}</span>
                              </div>
                            );
                          }
                          return null;
                        })}

                        {dayEvents.length > 2 && (
                          <div className="text-[7px] sm:text-[8px] font-black text-amber-400/90 pl-0.5 truncate min-w-0">
                            +{dayEvents.length - 2} sự kiện
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

        {/* Day Detail Panel (Permanent sidebar on Desktop) */}
        <div className="hidden lg:block w-80 xl:w-96 shrink-0">
          <DayDetailPanel
            selectedDate={selectedDate}
            events={selectedDate ? (dayEventsMap[selectedDate] || []) : []}
            onAddEvent={() => handleAddEventOnDate(selectedDate)}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      </div>

      {/* Centered Floating Executive Glass Modal for Day Details on Mobile */}
      {showMobileDetail && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in lg:hidden">
          {/* Backdrop Click Handler */}
          <div
            className="absolute inset-0"
            onClick={() => setShowMobileDetail(false)}
          />
          {/* Centered Executive Glass Card */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-500/20 overflow-hidden max-h-[82vh] flex flex-col animate-scale-in">
            <DayDetailPanel
              selectedDate={selectedDate}
              events={dayEventsMap[selectedDate] || []}
              onAddEvent={() => {
                setShowMobileDetail(false);
                handleAddEventOnDate(selectedDate);
              }}
              onClose={() => setShowMobileDetail(false)}
              isModal={true}
            />
          </div>
        </div>
      )}

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
