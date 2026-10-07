import { SKILL_LEVELS } from '../domain/skills.ts';
import { useState } from 'react';
import { useApp } from '../context.tsx';
import { Badge, Button, Icon, dateLabel } from './ui.tsx';
import { CalendarExplorer } from './CalendarViews.tsx';

export default function CalendarsPage() {
  const { store, openModal } = useApp();
  const calendars = store.calendars.filter((c) => c.school === 'campus-a');
  const [selected, setSelected] = useState(calendars[0]?.id);
  const calendar = calendars.find((c) => c.id === selected) ?? calendars[0];
  if (!calendar) return null;
  const count = store.students.filter(
    (s) =>
      s.school === 'campus-a' &&
      s.status !== 'withdrawn' &&
      (s.draft.trainingId === calendar.id || s.published?.trainingId === calendar.id),
  ).length;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Le rythme de vos formations.</h1>
          <p>
            Une lecture précise, du mois à l’année. Un calendrier partagé par tous les étudiants
            rattachés.
          </p>
        </div>
        <Button onClick={() => openModal({ kind: 'calendar', calendarId: calendar.id })}>
          <Icon name="edit" />
          Modifier le rythme
        </Button>
      </div>
      <div className="training-calendar-layout">
        <label className="mobile-training-picker">
          Formation
          <select value={calendar.id} onChange={(event) => setSelected(event.target.value)}>
            {calendars.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <aside className="panel training-picker">
          <h2>Formations</h2>
          {calendars.map((c) => (
            <button
              key={c.id}
              aria-pressed={c.id === calendar.id}
              onClick={() => setSelected(c.id)}
            >
              <strong>{c.title}</strong>
              <span>
                {c.mode === 'weekly'
                  ? 'Rythme hebdomadaire'
                  : c.mode === 'variable'
                    ? 'Rythme variable'
                    : 'À compléter'}
              </span>
            </button>
          ))}
        </aside>
        <section className="panel training-calendar">
          <div className="calendar-detail-heading">
            <div>
              <Badge tone={calendar.mode === 'weekly' ? 'green' : 'warning'}>
                {calendar.mode === 'weekly' ? 'Calendrier renseigné' : 'Planning à vérifier'}
              </Badge>
              <h2>{calendar.title}</h2>
              <p>
                {dateLabel(calendar.start)} → {dateLabel(calendar.end)}
              </p>
            </div>
            <span className="calendar-student-count">
              <Icon name="users" />
              {count} étudiants
            </span>
          </div>
          <section className="formation-learning-skills">
            <h3>Compétences visées par cette formation</h3>
            <p>
              Objectifs du programme : l’acquisition et le niveau de chaque candidat sont évalués
              individuellement.
            </p>
            <ul>
              {calendar.learningSkills?.map((skill) => (
                <li key={skill.id}>
                  <strong>{skill.name}</strong>
                  <span>Objectif : {SKILL_LEVELS[skill.targetLevel]}</span>
                </li>
              ))}
            </ul>
            {!calendar.learningSkills?.length && <p>Aucun objectif de compétence renseigné.</p>}
          </section>
          <CalendarExplorer key={calendar.id} calendar={calendar} />
          {!!calendar.exceptions?.length && (
            <div className="saved-exceptions">
              <h3>Exceptions du calendrier</h3>
              {calendar.exceptions.map((item) => (
                <div className="exception-row" key={item.id}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>
                      {dateLabel(item.start)} → {dateLabel(item.end)} ·{' '}
                      {item.kind === 'course'
                        ? 'Cours au centre'
                        : item.kind === 'potential'
                          ? 'Sans cours'
                          : 'Planning à vérifier'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
