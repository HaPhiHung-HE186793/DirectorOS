/**
 * Vietnamese Lunar Calendar Utility
 * Converts Solar (Dương lịch) ↔ Lunar (Âm lịch) dates
 * Uses solarlunar library for accurate conversion
 */
import solarLunar from 'solarlunar';

/**
 * Convert solar date to lunar date
 * @param {number} year - Solar year
 * @param {number} month - Solar month (1-12)
 * @param {number} day - Solar day
 * @returns {object} { lunarYear, lunarMonth, lunarDay, isLeap, monthCn, dayCn }
 */
export const solarToLunar = (year, month, day) => {
  try {
    const result = solarLunar.solar2lunar(year, month, day);
    return {
      lunarYear: result.lYear,
      lunarMonth: result.lMonth,
      lunarDay: result.lDay,
      isLeap: result.isLeap,
      monthCn: result.monthCn || '',
      dayCn: result.dayCn || '',
    };
  } catch (e) {
    console.warn(`Cannot convert ${year}/${month}/${day} to lunar:`, e);
    return null;
  }
};

/**
 * Get short lunar date display string
 * @param {number} year - Solar year
 * @param {number} month - Solar month (1-12)
 * @param {number} day - Solar day
 * @returns {string} "15/7" or "1/1" format
 */
export const getLunarDateShort = (year, month, day) => {
  const lunar = solarToLunar(year, month, day);
  if (!lunar) return '';
  return `${lunar.lunarDay}/${lunar.lunarMonth}`;
};

/**
 * Get full lunar date display string
 * @param {number} year - Solar year
 * @param {number} month - Solar month (1-12)
 * @param {number} day - Solar day
 * @returns {string} "Ngày 15 tháng 7 (Âm lịch)"
 */
export const getLunarDateFull = (year, month, day) => {
  const lunar = solarToLunar(year, month, day);
  if (!lunar) return '';
  const leapStr = lunar.isLeap ? ' (nhuận)' : '';
  return `Ngày ${lunar.lunarDay} tháng ${lunar.lunarMonth}${leapStr} Âm lịch`;
};

/**
 * Check if a solar date is Mùng 1 Âm lịch (first day of lunar month)
 */
export const isLunarNewMonth = (year, month, day) => {
  const lunar = solarToLunar(year, month, day);
  return lunar && lunar.lunarDay === 1;
};

/**
 * Check if a solar date is Rằm (15th lunar day)
 */
export const isLunarFullMoon = (year, month, day) => {
  const lunar = solarToLunar(year, month, day);
  return lunar && lunar.lunarDay === 15;
};

/**
 * Get all days for a calendar month grid (includes prev/next month padding)
 * Returns array of day objects for 6 rows x 7 columns grid
 * @param {number} year - Solar year
 * @param {number} month - Solar month (1-12)
 * @returns {Array<object>} Array of { date, day, month, year, isCurrentMonth, lunar, isToday }
 */
export const getCalendarGridDays = (year, month) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0, Sunday = 6 (Vietnamese calendar starts on Monday)
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6; // Sunday → last column

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const days = [];

  // Previous month padding
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const lunar = solarToLunar(prevYear, prevMonth, d);
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: dateStr,
      day: d,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      lunar: lunar ? `${lunar.lunarDay}/${lunar.lunarMonth}` : '',
      lunarDay: lunar?.lunarDay,
      lunarMonth: lunar?.lunarMonth,
      isToday: dateStr === todayStr,
      isLunarNewMonth: lunar?.lunarDay === 1,
      isLunarFullMoon: lunar?.lunarDay === 15,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const lunar = solarToLunar(year, month, d);
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: dateStr,
      day: d,
      month,
      year,
      isCurrentMonth: true,
      lunar: lunar ? `${lunar.lunarDay}/${lunar.lunarMonth}` : '',
      lunarDay: lunar?.lunarDay,
      lunarMonth: lunar?.lunarMonth,
      isToday: dateStr === todayStr,
      isLunarNewMonth: lunar?.lunarDay === 1,
      isLunarFullMoon: lunar?.lunarDay === 15,
    });
  }

  // Next month padding (fill to 42 cells = 6 rows)
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const lunar = solarToLunar(nextYear, nextMonth, d);
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: dateStr,
      day: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      lunar: lunar ? `${lunar.lunarDay}/${lunar.lunarMonth}` : '',
      lunarDay: lunar?.lunarDay,
      lunarMonth: lunar?.lunarMonth,
      isToday: dateStr === todayStr,
      isLunarNewMonth: lunar?.lunarDay === 1,
      isLunarFullMoon: lunar?.lunarDay === 15,
    });
  }

  return days;
};

/**
 * Vietnamese month names
 */
export const MONTH_NAMES_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export const WEEKDAY_NAMES_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
