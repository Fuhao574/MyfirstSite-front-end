/**
 * 日历卡片组件
 * iCost 风格：白色底 + 左侧彩色装饰条
 * 法定节假日/周末：绿色小点
 * 特殊日期：红色小点
 * 调休上班日：灰色标记
 * 周一开始，需要6行时从1号星期开始
 */

import { useState, useMemo } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

/* 动画 */
const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

/* ============================================
   2026年法定节假日
   ============================================ */
const HOLIDAYS_2026: Record<string, string> = {
  '1-1': '元旦', '1-2': '元旦', '1-3': '元旦',
  '2-15': '除夕', '2-16': '春节', '2-17': '春节', '2-18': '春节',
  '2-19': '春节', '2-20': '春节', '2-21': '春节', '2-22': '春节', '2-23': '春节',
  '4-4': '清明', '4-5': '清明', '4-6': '清明',
  '5-1': '劳动节', '5-2': '劳动节', '5-3': '劳动节', '5-4': '劳动节', '5-5': '劳动节',
  '6-19': '端午', '6-20': '端午', '6-21': '端午',
  '9-25': '中秋', '9-26': '中秋', '9-27': '中秋',
  '10-1': '国庆', '10-2': '国庆', '10-3': '国庆', '10-4': '国庆',
  '10-5': '国庆', '10-6': '国庆', '10-7': '国庆',
};

/* 调休上班日 */
const WORKDAYS_2026: Record<string, string> = {
  '1-4': '调休', '2-14': '调休', '2-28': '调休',
  '5-9': '调休', '9-20': '调休', '10-10': '调休',
};

/* 特殊日期（红色标记） */
const SPECIAL_DATES: Record<string, string> = {
  '1-1': '元旦', '2-14': '情人节', '3-8': '妇女节',
  '5-4': '青年节', '6-1': '儿童节',
  '10-31': '万圣节', '12-25': '圣诞节',
};

const ALL_WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/* ============================================
   iCost 风格样式
   ============================================ */
const CalendarWrapper = styled.div`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadowLight};
  border: 1px solid rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;

  animation: ${cardEnter} 0.6s 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  transition: ${theme.transitions.default};

  /* 左侧装饰条 */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
    opacity: 0.6;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.08),
      0 12px 40px rgba(0, 0, 0, 0.06);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
  padding-left: 4px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CalendarIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
  color: white;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
  }
`;

const MonthTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.3px;
`;

const NavBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bgTertiary};
  color: ${theme.colors.textSecondary};
  transition: ${theme.transitions.fast};

  &:hover {
    background: rgba(99, 102, 241, 0.12);
    color: ${theme.colors.accentBlue};
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.94);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 2px;
  padding-left: 4px;
`;

const WeekdayCell = styled.span`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.textTertiary};
  padding: 4px 0;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding-left: 4px;
`;

const DayCell = styled.div<{
  isToday: boolean;
  isHoliday: boolean;
  isWorkday: boolean;
  isSpecial: boolean;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isSelected: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 0 6px;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  min-height: 36px;

  font-size: 13px;
  font-weight: ${({ isToday, isSelected }) => (isToday || isSelected ? 700 : 400)};
  color: ${({ isCurrentMonth, isToday, isWorkday }) => {
    if (isToday) return '#ffffff';
    if (!isCurrentMonth || isWorkday) return theme.colors.textTertiary;
    return theme.colors.textPrimary;
  }};
  background: ${({ isToday, isSelected }) => {
    if (isToday) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (isSelected) return 'rgba(99, 102, 241, 0.12)';
    return 'transparent';
  }};
  outline: ${({ isSelected, isToday }) =>
    isSelected && !isToday ? '2px solid rgba(99, 102, 241, 0.4)' : 'none'};

  &:hover {
    background: ${({ isToday, isSelected }) => {
      if (isToday) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      if (isSelected) return 'rgba(99, 102, 241, 0.18)';
      return 'rgba(99, 102, 241, 0.06)';
    }};
    transform: scale(1.05);
  }

  /* 底部小点 */
  &::after {
    content: '';
    position: absolute;
    bottom: 3px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ isHoliday, isSpecial, isWorkday, isWeekend }) => {
      if (isWorkday) return 'transparent';
      if (isHoliday || isWeekend) return '#22C55E';
      if (isSpecial) return '#EF4444';
      return 'transparent';
    }};
  }
`;

const Tooltip = styled.div<{ show: boolean }>`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.bgPrimary};
  color: ${theme.colors.textPrimary};
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: ${theme.borderRadius.sm};
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${theme.colors.bgPrimary};
  }
`;

/* ============================================
   组件
   ============================================ */
export default function CalendarCard() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const { days: calendarDays, weekdayLabels } = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevDays = new Date(viewYear, viewMonth, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=周日,1=周一...

    // 默认以周一为第一天：需要填充的前几天
    // 周一=1 → 0天, 周二=2 → 1天, ..., 周日=0 → 6天
    let padBefore = (firstDayOfWeek + 6) % 7;
    let weekStart = 1; // 周一

    // 如果填充+当月超过35天，则从1号所在星期开始
    if (padBefore + daysInMonth > 35) {
      padBefore = 0;
      weekStart = firstDayOfWeek;
    }

    // 生成表头（从 weekStart 开始循环7天）
    const weekdayLabels: string[] = [];
    for (let i = 0; i < 7; i++) {
      weekdayLabels.push(ALL_WEEKDAYS[(weekStart + i) % 7]);
    }

    const days: Array<{
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      dateKey: string;
      weekday: number;
    }> = [];

    // 上月填充
    for (let i = padBefore - 1; i >= 0; i--) {
      const d = prevDays - i;
      const m = viewMonth - 1;
      const y = m < 0 ? viewYear - 1 : viewYear;
      const wd = new Date(y, m < 0 ? 11 : m, d).getDay();
      days.push({
        day: d,
        month: m < 0 ? 11 : m,
        year: y,
        isCurrentMonth: false,
        dateKey: `${y}-${m < 0 ? 11 : m}-${d}`,
        weekday: wd,
      });
    }

    // 当月
    for (let d = 1; d <= daysInMonth; d++) {
      const wd = new Date(viewYear, viewMonth, d).getDay();
      days.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        dateKey: `${viewYear}-${viewMonth}-${d}`,
        weekday: wd,
      });
    }

    // 下月填充 — 补到35天（5行）
    const remaining = 35 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth + 1;
      const y = m > 11 ? viewYear + 1 : viewYear;
      const wd = new Date(y, m > 11 ? 0 : m, d).getDay();
      days.push({
        day: d,
        month: m > 11 ? 0 : m,
        year: y,
        isCurrentMonth: false,
        dateKey: `${y}-${m > 11 ? 0 : m}-${d}`,
        weekday: wd,
      });
    }

    return { days, weekStart, weekdayLabels };
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isToday = (day: typeof calendarDays[number]) =>
    day.day === today.getDate() &&
    day.month === today.getMonth() &&
    day.year === today.getFullYear();

  const isHoliday = (day: typeof calendarDays[number]) =>
    day.year === 2026 && `${day.month + 1}-${day.day}` in HOLIDAYS_2026;

  const isWorkday = (day: typeof calendarDays[number]) =>
    day.year === 2026 && `${day.month + 1}-${day.day}` in WORKDAYS_2026;

  const isSpecial = (day: typeof calendarDays[number]) =>
    day.year === 2026 && `${day.month + 1}-${day.day}` in SPECIAL_DATES;

  const isWeekend = (day: typeof calendarDays[number]) => {
    if (isWorkday(day)) return false;
    return day.weekday === 0 || day.weekday === 6;
  };

  const getTooltip = (day: typeof calendarDays[number]) => {
    const key2026 = `${day.month + 1}-${day.day}`;

    if (day.year === 2026) {
      if (HOLIDAYS_2026[key2026]) return HOLIDAYS_2026[key2026];
      if (WORKDAYS_2026[key2026]) return WORKDAYS_2026[key2026];
      if (SPECIAL_DATES[key2026]) return SPECIAL_DATES[key2026];
    }

    if (isWeekend(day)) return '休息日';
    if (selectedDateKey === day.dateKey) return '普通的一天';
    return null;
  };

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ];

  return (
    <CalendarWrapper>
      <CalendarHeader>
        <HeaderLeft>
          <CalendarIcon>
            <Calendar />
          </CalendarIcon>
          <MonthTitle>
            {viewYear}年{monthNames[viewMonth]}
          </MonthTitle>
        </HeaderLeft>
        <div style={{ display: 'flex', gap: '4px' }}>
          <NavBtn onClick={prevMonth} aria-label="上个月">
            <ChevronLeft />
          </NavBtn>
          <NavBtn onClick={nextMonth} aria-label="下个月">
            <ChevronRight />
          </NavBtn>
        </div>
      </CalendarHeader>

      <WeekdayRow>
        {weekdayLabels.map((w, i) => (
          <WeekdayCell key={`${w}-${i}`}>{w}</WeekdayCell>
        ))}
      </WeekdayRow>

      <DaysGrid>
        {calendarDays.map((day, i) => {
          const today_flag = isToday(day);
          const holiday = isHoliday(day);
          const workday = isWorkday(day);
          const special = isSpecial(day);
          const weekend = isWeekend(day);
          const tooltip = getTooltip(day);
          const selected = selectedDateKey === day.dateKey;

          return (
            <DayCell
              key={i}
              isToday={today_flag}
              isHoliday={holiday}
              isWorkday={workday}
              isSpecial={special}
              isCurrentMonth={day.isCurrentMonth}
              isWeekend={weekend}
              isSelected={selected}
              onMouseEnter={() => setHoveredDay(day.dateKey)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => setSelectedDateKey(day.dateKey)}
            >
              {day.day}
              {tooltip && hoveredDay === day.dateKey && (
                <Tooltip show>{tooltip}</Tooltip>
              )}
            </DayCell>
          );
        })}
      </DaysGrid>
    </CalendarWrapper>
  );
}
