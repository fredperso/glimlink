import Select from './Select.tsx';
import { SKILL_LEVELS, skillKey, type SkillLevel } from '../domain/skills.ts';
import { saveTraining } from '../domain/administration.ts';
import { useState, type FormEvent } from 'react';
import { useApp } from '../context.tsx';
import { DAYS, createId, type Calendar, type CalendarException } from '../domain/model.ts';
import { Button, Icon, Modal, dateLabel } from './ui.tsx';
import { CalendarExplorer } from './CalendarViews.tsx';

export default function CalendarEditor({ calendarId }: { calendarId?: string }) {
  const { store, setStore, closeModal, notify, role } = useApp();
  const calendar = store.calendars.find((c) => c.id === calendarId);
  const [draft, setDraft] = useState<Calendar>(
    calendar
      ? structuredClone(calendar)
      : {
          id: createId(),
          title: '',
          school: 'campus-a',
          mode: 'weekly',
          courseDays: [],
          start: '',
          end: '',
          learningSkills: [],
          exceptions: [],
        },
  );
  const [error, setError] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('autonomous');
  const [exception, setException] = useState<CalendarException | null>(null);
  if (!draft || role !== 'admin') return null;
  const count = store.students.filter(
    (s) =>
      s.school === draft.school &&
      s.status !== 'withdrawn' &&
      (s.draft.trainingId === draft.id || s.published?.trainingId === draft.id),
  ).length;
  function addException() {
    if (!exception || !draft) return;
    if (
      !exception.label.trim() ||
      !exception.start ||
      !exception.end ||
      exception.end < exception.start
    ) {
      setError('Renseignez un libellé et une période valide pour l’exception.');
      return;
    }
    if (exception.start < draft.start || exception.end > draft.end) {
      setError('L’exception doit rester dans la période de la formation.');
      return;
    }
    if (
      draft.exceptions?.some(
        (item) =>
          item.id !== exception.id && item.start <= exception.end && item.end >= exception.start,
      )
    ) {
      setError('Cette période chevauche une autre exception. Modifiez la période existante.');
      return;
    }
    setDraft({
      ...draft,
      exceptions: [
        ...(draft.exceptions ?? []).filter((item) => item.id !== exception.id),
        { ...exception, label: exception.label.trim() },
      ].sort((a, b) => a.start.localeCompare(b.start)),
    });
    setException(null);
    setError('');
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    if (skillName.trim()) {
      setError('Ajoutez la compétence en cours ou effacez sa saisie avant d’enregistrer.');
      return;
    }
    if (!draft.title.trim() || !draft.start || !draft.end || !draft.learningSkills?.length) {
      setError('Renseignez le nom, la période et au moins une compétence visée.');
      return;
    }
    if (exception) {
      setError('Ajoutez l’exception en cours ou annulez sa saisie avant d’enregistrer.');
      return;
    }
    if (
      draft.end < draft.start ||
      draft.exceptions?.some((item) => item.start < draft.start || item.end > draft.end)
    ) {
      setError('Vérifiez la période de formation : elle doit inclure toutes les exceptions.');
      return;
    }
    setStore((prev) => saveTraining(prev, draft, role));
    closeModal();
    notify(
      calendar
        ? `Formation mise à jour pour ${count} étudiants rattachés.`
        : 'Formation ajoutée avec son planning et ses compétences.',
    );
  }
  return (
    <Modal
      title={calendar ? 'Modifier la formation et son planning' : 'Ajouter une formation'}
      onClose={closeModal}
      wide
    >
      <form onSubmit={submit} className="calendar-editor-form">
        <div className="notice">
          <Icon name="users" />
          {count} étudiants héritent de ce calendrier. Les disponibilités individuelles restent
          distinctes.
        </div>
        <div className="form-grid">
          <label>
            Nom de la formation
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label>
            Campus
            <Select
              value={draft.school}
              disabled={!!calendar}
              onChange={(e) => setDraft({ ...draft, school: e.target.value })}
            >
              <option value="campus-a">Atelier Campus</option>
              <option value="campus-b">Campus B</option>
            </Select>
          </label>
        </div>
        <section className="formation-learning-skills">
          <h3>Compétences visées</h3>
          <p>
            Les objectifs de la formation ne valident pas automatiquement les compétences des
            candidats.
          </p>
          {draft.learningSkills?.map((skill) => (
            <div className="exception-row" key={skill.id}>
              <strong>{skill.name}</strong>
              <label>
                Niveau cible pour {skill.name}
                <Select
                  value={skill.targetLevel}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      learningSkills: draft.learningSkills?.map((item) =>
                        item.id === skill.id
                          ? { ...item, targetLevel: e.target.value as SkillLevel }
                          : item,
                      ),
                    })
                  }
                >
                  {Object.entries(SKILL_LEVELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </label>
              <button
                type="button"
                className="icon-button"
                aria-label={`Supprimer la compétence ${skill.name}`}
                onClick={() =>
                  setDraft({
                    ...draft,
                    learningSkills: draft.learningSkills?.filter((item) => item.id !== skill.id),
                  })
                }
              >
                <Icon name="close" />
              </button>
            </div>
          ))}
          <div className="form-grid">
            <label>
              Nom de la compétence
              <input value={skillName} onChange={(e) => setSkillName(e.target.value)} />
            </label>
            <label>
              Niveau cible
              <Select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
              >
                {Object.entries(SKILL_LEVELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </label>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              if (
                !skillName.trim() ||
                draft.learningSkills?.some((item) => skillKey(item.name) === skillKey(skillName))
              ) {
                setError('Saisissez une compétence distincte de celles déjà ajoutées.');
                return;
              }
              setDraft({
                ...draft,
                learningSkills: [
                  ...(draft.learningSkills ?? []),
                  { id: createId(), name: skillName.trim(), targetLevel: skillLevel },
                ],
              });
              setSkillName('');
              setError('');
            }}
          >
            Ajouter la compétence
          </Button>
        </section>
        <div className="calendar-editor-layout">
          <div className="calendar-settings">
            <h4>1. Le rythme de référence</h4>
            <label>
              Granularité du rythme
              <Select
                name="mode"
                value={draft.mode}
                onChange={(e) => setDraft({ ...draft, mode: e.target.value as Calendar['mode'] })}
              >
                <option value="weekly">Rythme hebdomadaire stable</option>
                <option value="variable">Rythme variable — vérification nécessaire</option>
                <option value="unknown">Calendrier non renseigné</option>
              </Select>
            </label>
            {draft.mode === 'weekly' ? (
              <fieldset>
                <legend>Les jours de cours</legend>
                <div className="day-toggles">
                  {DAYS.map((day) => (
                    <label key={day} className={draft.courseDays.includes(day) ? 'checked' : ''}>
                      <input
                        type="checkbox"
                        name="courseDays"
                        checked={draft.courseDays.includes(day)}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            courseDays: e.target.checked
                              ? [...draft.courseDays, day]
                              : draft.courseDays.filter((d) => d !== day),
                          })
                        }
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <p className="micro">
                Les jours restent à vérifier. Ajoutez des périodes datées pour renseigner les cours
                connus.
              </p>
            )}
            <div className="form-grid">
              <label>
                Début d’application
                <input
                  type="date"
                  name="start"
                  required
                  value={draft.start}
                  onChange={(e) => setDraft({ ...draft, start: e.target.value })}
                />
              </label>
              <label>
                Fin d’application
                <input
                  type="date"
                  name="end"
                  required
                  min={draft.start}
                  value={draft.end}
                  onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                />
              </label>
            </div>
            <div className="exception-heading">
              <h4>2. Les exceptions datées</h4>
              <Button
                variant="secondary"
                onClick={() => {
                  setException({
                    id: createId(),
                    start: draft.start,
                    end: draft.start,
                    kind: 'course',
                    label: '',
                  });
                  setError('');
                }}
              >
                <Icon name="plus" />
                Ajouter
              </Button>
            </div>
            <p className="micro">
              Une exception remplace le rythme habituel sur les jours ouvrés de sa période.
            </p>
            {!draft.exceptions?.length && (
              <p className="exception-empty">
                Aucune exception. Le rythme de référence s’applique à toute la période.
              </p>
            )}
            {draft.exceptions?.map((item) => (
              <div className="exception-row" key={item.id}>
                <div>
                  <strong>{item.label}</strong>
                  <span>
                    {dateLabel(item.start)} → {dateLabel(item.end)} ·{' '}
                    {item.kind === 'course'
                      ? 'Cours'
                      : item.kind === 'potential'
                        ? 'Sans cours'
                        : 'À vérifier'}
                  </span>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Modifier l’exception ${item.label}`}
                  onClick={() => setException({ ...item })}
                >
                  <Icon name="edit" />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Supprimer l’exception ${item.label}`}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      exceptions: draft.exceptions?.filter((e) => e.id !== item.id),
                    })
                  }
                >
                  <Icon name="close" />
                </button>
              </div>
            ))}
            {exception && (
              <div className="exception-form">
                <label>
                  Libellé de l’exception
                  <input
                    value={exception.label}
                    placeholder="Ex. semaine de regroupement"
                    onChange={(e) => setException({ ...exception, label: e.target.value })}
                  />
                </label>
                <div className="form-grid">
                  <label>
                    Début de l’exception
                    <input
                      type="date"
                      value={exception.start}
                      min={draft.start}
                      max={draft.end}
                      onChange={(e) => setException({ ...exception, start: e.target.value })}
                    />
                  </label>
                  <label>
                    Fin de l’exception
                    <input
                      type="date"
                      value={exception.end}
                      min={exception.start}
                      max={draft.end}
                      onChange={(e) => setException({ ...exception, end: e.target.value })}
                    />
                  </label>
                </div>
                <label>
                  Type de période
                  <Select
                    value={exception.kind}
                    onChange={(e) =>
                      setException({
                        ...exception,
                        kind: e.target.value as CalendarException['kind'],
                      })
                    }
                  >
                    <option value="course">Cours au centre</option>
                    <option value="potential">Sans cours · présence potentielle</option>
                    <option value="unknown">Planning à vérifier</option>
                  </Select>
                </label>
                <div className="exception-actions">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setException(null);
                      setError('');
                    }}
                  >
                    Annuler l’exception
                  </Button>
                  <Button onClick={addException}>Appliquer l’exception</Button>
                </div>
              </div>
            )}
          </div>
          <section className="calendar-live-preview">
            <h4>3. Aperçu avant enregistrement</h4>
            <CalendarExplorer
              calendar={draft}
              editable
              onDate={(date) => {
                const existing = draft.exceptions?.find(
                  (item) => item.start <= date && item.end >= date,
                );
                setException(
                  existing
                    ? { ...existing }
                    : { id: createId(), start: date, end: date, kind: 'course', label: '' },
                );
                setError('');
              }}
            />
          </section>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-footer">
          <Button variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer le calendrier</Button>
        </div>
      </form>
    </Modal>
  );
}
