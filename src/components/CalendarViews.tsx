import { useState } from 'react';
import type { Calendar, StudentDetails } from '../domain/model.ts';
import {
  CALENDAR_DAY_LABELS,
  calendarDay,
  calendarMonthLabel,
  monthDates,
  monthSummary,
  weekdayForDate,
} from '../domain/calendar.ts';
import { Button, Icon } from './ui.tsx';

const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const weekdayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export function CalendarLegend({ individual = false }: { individual?: boolean }) {
  return (
    <div className="calendar-legend">
      {individual && (
        <span>
          <i className="date-unavailable" aria-hidden="true">
            <Icon name="close" size={12} />
          </i>
          Indisponibilité individuelle
        </span>
      )}
      {Object.entries(CALENDAR_DAY_LABELS).map(([kind, label]) => (
        <span key={kind}>
          <i className={`date-${kind}`} aria-hidden="true">
            <Icon
              name={
                kind === 'potential'
                  ? 'check'
                  : kind === 'course'
                    ? 'file'
                    : kind === 'unknown'
                      ? 'help'
                      : kind === 'weekend'
                        ? 'clock'
                        : 'close'
              }
              size={12}
            />
          </i>
          {label}
        </span>
      ))}
    </div>
  );
}
export function MonthGrid({
  calendar,
  year,
  month,
  compact = false,
  onDate,
  availability,
}: {
  availability?: StudentDetails;
  calendar: Calendar;
  year: number;
  month: number;
  compact?: boolean;
  onDate?: (date: string) => void;
}) {
  return (
    <div
      className={`month-grid ${compact ? 'compact' : ''}`}
      aria-label={calendarMonthLabel(year, month)}
    >
      {weekdays.map((day, index) => (
        <div
          className="weekday-label"
          key={day}
          aria-label={weekdayNames[index]}
          title={weekdayNames[index]}
        >
          {compact ? day[0] : day}
        </div>
      ))}
      {monthDates(year, month).map((date, index) => {
        if (!date) return <span className="date-blank" key={`blank-${index}`} />;
        const baseKind = calendarDay(calendar, date);
        const individualOff =
          availability &&
          (availability.unavailableDays.includes(weekdayForDate(date)!) ||
            (availability.availableFrom && date < availability.availableFrom));
        const kind =
          baseKind === 'potential' && individualOff
            ? 'unavailable'
            : baseKind === 'potential' && availability && !availability.availableFrom
              ? 'unknown'
              : baseKind;
        const dayLabel =
          kind === 'unavailable' ? 'Indisponibilité individuelle' : CALENDAR_DAY_LABELS[kind];
        const exception = calendar.exceptions?.find(
          (item) => item.start <= date && item.end >= date,
        );
        const label = `${new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))} : ${dayLabel}${exception && kind !== 'weekend' && kind !== 'outside' ? `, ${exception.label}` : ''}`;
        const content = (
          <>
            <strong>{Number(date.slice(-2))}</strong>
            {!compact && (
              <span className="date-status-text">
                {kind === 'unavailable'
                  ? 'Indispo.'
                  : kind === 'course'
                    ? 'En cours'
                    : kind === 'potential'
                      ? 'Dispo. possible'
                      : kind === 'unknown'
                        ? 'À vérifier'
                        : kind === 'weekend'
                          ? 'Week-end'
                          : 'Hors période'}
              </span>
            )}
            {!compact && (
              <span className="date-status-symbol" aria-hidden="true">
                <Icon
                  name={
                    kind === 'potential'
                      ? 'check'
                      : kind === 'course'
                        ? 'file'
                        : kind === 'unknown'
                          ? 'help'
                          : kind === 'weekend'
                            ? 'clock'
                            : 'close'
                  }
                  size={16}
                />
              </span>
            )}
            {exception && kind !== 'weekend' && kind !== 'outside' && (
              <b className="exception-dot" aria-hidden="true">
                •
              </b>
            )}
          </>
        );
        return onDate && kind !== 'outside' && kind !== 'weekend' ? (
          <button
            type="button"
            key={date}
            className={`date-cell date-${kind}`}
            aria-label={label}
            title={label}
            onClick={() => onDate(date)}
          >
            {content}
          </button>
        ) : (
          <div key={date} className={`date-cell date-${kind}`} aria-label={label} title={label}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
export function CalendarExplorer({
  calendar,
  editable = false,
  onDate,
  initialDate,
  availability,
}: {
  calendar: Calendar;
  editable?: boolean;
  initialDate?: string;
  availability?: StudentDetails;
  onDate?: (date: string) => void;
}) {
  const [view, setView] = useState<'month' | 'year'>('month');
  const [cursor, setCursor] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    const date =
      initialDate || (today >= calendar.start && today <= calendar.end ? today : calendar.start);
    return { year: Number(date.slice(0, 4)), month: Number(date.slice(5, 7)) - 1 };
  });
  const summary = monthSummary(calendar, cursor.year, cursor.month);
  function move(step: number) {
    const date = new Date(
      Date.UTC(cursor.year, cursor.month + (view === 'year' ? step * 12 : step), 1),
    );
    setCursor({ year: date.getUTCFullYear(), month: date.getUTCMonth() });
  }
  return (
    <div className="calendar-explorer">
      <div className="calendar-toolbar">
        <div className="calendar-navigation">
          <button
            type="button"
            className="icon-button"
            aria-label={view === 'month' ? 'Mois précédent' : 'Année précédente'}
            onClick={() => move(-1)}
          >
            ‹
          </button>
          <h3 aria-live="polite">
            {view === 'month' ? calendarMonthLabel(cursor.year, cursor.month) : cursor.year}
          </h3>
          <button
            type="button"
            className="icon-button"
            aria-label={view === 'month' ? 'Mois suivant' : 'Année suivante'}
            onClick={() => move(1)}
          >
            ›
          </button>
        </div>
        <div className="calendar-view-switch" aria-label="Vue du calendrier">
          {(['month', 'year'] as const).map((mode) => (
            <button
              type="button"
              key={mode}
              aria-pressed={view === mode}
              onClick={() => setView(mode)}
            >
              {mode === 'month' ? 'Mois' : 'Année'}
            </button>
          ))}
        </div>
      </div>
      <CalendarLegend individual={!!availability} />
      {view === 'month' ? (
        <>
          <MonthGrid
            calendar={calendar}
            availability={availability}
            {...cursor}
            onDate={editable ? onDate : undefined}
          />
          <div className="month-summary">
            <span>
              <strong>{summary.course}</strong> jours de cours
            </span>
            <span>
              <strong>{summary.potential}</strong> jours sans cours
            </span>
            <span>
              <strong>{summary.unknown}</strong> jours à vérifier
            </span>
          </div>
        </>
      ) : (
        <div className="year-grid">
          {Array.from({ length: 12 }, (_, month) => (
            <button
              type="button"
              className="year-month"
              key={month}
              onClick={() => {
                setCursor({ ...cursor, month });
                setView('month');
              }}
              aria-label={`Ouvrir ${calendarMonthLabel(cursor.year, month)}`}
            >
              <h4>{calendarMonthLabel(cursor.year, month, false)}</h4>
              <MonthGrid
                calendar={calendar}
                availability={availability}
                year={cursor.year}
                month={month}
                compact
              />
              <span className="year-month-summary">
                {monthSummary(calendar, cursor.year, month).course} jours de cours
              </span>
            </button>
          ))}
        </div>
      )}
      <p className="micro">
        {editable ? 'Cliquez sur un jour ouvré pour préparer une exception. ' : ''}Les jours sans
        cours ne confirment pas la disponibilité individuelle. Les week-ends ne sont pas évalués.
        {calendar.exceptions?.length ? ' • Une pastille signale une exception datée.' : ''}
      </p>
      <Button
        variant="secondary"
        onClick={() => {
          setCursor({
            year: Number(calendar.start.slice(0, 4)),
            month: Number(calendar.start.slice(5, 7)) - 1,
          });
          setView('month');
        }}
      >
        Début de la formation
      </Button>
    </div>
  );
}
