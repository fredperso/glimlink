import type { Calendar, Day } from './model.ts';

export type CalendarDayKind = 'course' | 'potential' | 'unknown' | 'weekend' | 'outside';
export const CALENDAR_DAY_LABELS: Record<CalendarDayKind, string> = {
  potential: 'Disponible en entreprise · à confirmer',
  course: 'En cours · au centre de formation',
  unknown: 'Planning à vérifier',
  weekend: 'Week-end · non évalué',
  outside: 'Hors période du calendrier',
};
export function parseCalendarDate(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}
export function calendarDate(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month, day, 12)).toISOString().slice(0, 10);
}
export function weekdayForDate(value: string): Day | null {
  return (
    (['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const)[
      (parseCalendarDate(value).getUTCDay() + 6) % 7
    ] ?? null
  );
}
export function datesBetween(start: string, end: string): string[] {
  if (!start || !end || end < start) return [];
  const date = parseCalendarDate(start);
  const values: string[] = [];
  while (date.toISOString().slice(0, 10) <= end && values.length < 3660) {
    values.push(date.toISOString().slice(0, 10));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return values;
}
export function calendarDay(calendar: Calendar, value: string): CalendarDayKind {
  if (value < calendar.start || value > calendar.end) return 'outside';
  const day = weekdayForDate(value);
  if (!day) return 'weekend';
  const exception = [...(calendar.exceptions ?? [])]
    .reverse()
    .find((item) => item.start <= value && item.end >= value);
  if (exception) return exception.kind;
  return calendar.mode !== 'weekly'
    ? 'unknown'
    : calendar.courseDays.includes(day)
      ? 'course'
      : 'potential';
}
export function monthDates(year: number, month: number): (string | null)[] {
  const first = parseCalendarDate(calendarDate(year, month, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= count; day++) cells.push(calendarDate(year, month, day));
  while (cells.length % 7) cells.push(null);
  return cells;
}
export function monthSummary(calendar: Calendar, year: number, month: number) {
  const counts = { course: 0, potential: 0, unknown: 0, weekend: 0, outside: 0 };
  for (const value of monthDates(year, month)) if (value) counts[calendarDay(calendar, value)]++;
  return counts;
}
export function calendarMonthLabel(year: number, month: number, withYear = true): string {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    ...(withYear ? ({ year: 'numeric' } as const) : {}),
    timeZone: 'UTC',
  }).format(parseCalendarDate(calendarDate(year, month, 1)));
}
