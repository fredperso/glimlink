import { useState, useRef } from 'react';
import type { Calendar } from '../domain/model.ts';
import { createId } from '../domain/model.ts';
import {
  addSkill,
  skillKey,
  SKILL_LEVELS,
  type StudentSkill,
  type SkillLevel,
} from '../domain/skills.ts';
import { Badge, Button, Icon } from './ui.tsx';

export function SkillList({
  skills,
  calendars,
  compact = false,
}: {
  skills: StudentSkill[];
  calendars: Calendar[];
  compact?: boolean;
}) {
  const groups = ['acquired', 'learning'] as const;
  return (
    <div className={`competency-display ${compact ? 'competency-compact' : ''}`}>
      {groups.map((status) => {
        const list = skills.filter((skill) => skill.status === status);
        if (!list.length) return null;
        return (
          <section className={`competency-group competency-${status}`} key={status}>
            <h4>
              <Icon name={status === 'acquired' ? 'check' : 'clock'} size={16} />
              {status === 'acquired' ? 'Compétences acquises' : 'En cours d’acquisition'}{' '}
              <span>{list.length}</span>
            </h4>
            <ul>
              {(compact ? list.slice(0, status === 'acquired' ? 3 : 2) : list).map((skill) => {
                const calendar = calendars.find((item) => item.id === skill.trainingId);
                return (
                  <li key={skill.id}>
                    <div>
                      <strong>{skill.name}</strong>
                      <span>{SKILL_LEVELS[skill.level]}</span>
                    </div>
                    {calendar && (
                      <small>
                        <Icon name="brief" size={14} />
                        {calendar.title.split(' · ')[0]}
                      </small>
                    )}
                  </li>
                );
              })}
            </ul>
            {compact && list.length > (status === 'acquired' ? 3 : 2) && (
              <p className="micro">
                + {list.length - (status === 'acquired' ? 3 : 2)} à consulter sur la fiche
              </p>
            )}
          </section>
        );
      })}
      {!skills.length && <p className="micro">Aucune compétence renseignée.</p>}
    </div>
  );
}

export default function SkillsEditor({
  skills,
  trainingId,
  calendars,
  onChange,
}: {
  skills: StudentSkill[];
  trainingId: string;
  calendars: Calendar[];
  onChange: (skills: StudentSkill[]) => void;
}) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<SkillLevel>('unknown');
  const [status, setStatus] = useState<StudentSkill['status']>('acquired');
  const [linked, setLinked] = useState(false);
  const [error, setError] = useState('');
  const [removed, setRemoved] = useState<{ skill: StudentSkill; index: number } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const training = calendars.find((calendar) => calendar.id === trainingId);
  const suggestions = (training?.learningSkills ?? []).filter(
    (item) => !skills.some((skill) => skillKey(skill.name) === skillKey(item.name)),
  );
  function add() {
    if (!name.trim()) {
      setError('Indiquez le nom de la compétence.');
      input.current?.focus();
      return;
    }
    if (skills.some((skill) => skillKey(skill.name) === skillKey(name))) {
      setError('Cette compétence est déjà présente. Modifiez son niveau ou son statut.');
      input.current?.focus();
      return;
    }
    onChange(
      addSkill(skills, {
        id: createId(),
        name: name.trim(),
        level,
        status,
        trainingId: linked && training ? training.id : null,
      }),
    );
    setName('');
    setError('');
    input.current?.focus();
  }
  function patch(id: string, values: Partial<StudentSkill>) {
    onChange(skills.map((skill) => (skill.id === id ? { ...skill, ...values } : skill)));
    setError('');
  }
  return (
    <section className="skills-editor" aria-labelledby="skills-title">
      <div className="section-heading">
        <div>
          <h3 id="skills-title">Compétences du candidat</h3>
          <p>Niveau actuel et état d’acquisition sont deux informations distinctes.</p>
        </div>
        <Badge>
          {skills.filter((skill) => skill.status === 'acquired').length} acquises ·{' '}
          {skills.filter((skill) => skill.status === 'learning').length} en cours
        </Badge>
      </div>
      <div className="skill-add-panel">
        <h4>Ajouter une compétence</h4>
        <div className="skill-add-fields">
          <label>
            Nom de la compétence
            <input
              ref={input}
              name="skillName"
              value={name}
              maxLength={100}
              placeholder="Ex. Excel, relation client…"
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  add();
                }
              }}
            />
          </label>
          <label>
            Niveau actuel
            <select
              aria-label="Niveau actuel"
              value={level}
              onChange={(event) => setLevel(event.target.value as SkillLevel)}
            >
              {Object.entries(SKILL_LEVELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            État d’acquisition
            <select
              aria-label="État d’acquisition"
              value={status}
              onChange={(event) => setStatus(event.target.value as StudentSkill['status'])}
            >
              <option value="acquired">Acquise</option>
              <option value="learning">En cours d’acquisition</option>
            </select>
          </label>
        </div>
        <div className="skill-add-actions">
          {training && (
            <label className="skill-training-checkbox">
              <input
                type="checkbox"
                checked={linked}
                onChange={(event) => setLinked(event.target.checked)}
              />
              Associer à la formation actuelle
            </label>
          )}
          <Button onClick={add}>
            <Icon name="plus" />
            Ajouter la compétence
          </Button>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
      <details className="skill-level-help">
        <summary>Comment attribuer un niveau ?</summary>
        <ul>
          <li>
            <strong>Notions :</strong> connaît les bases, découvre la mise en pratique.
          </li>
          <li>
            <strong>Pratique accompagnée :</strong> réalise des tâches avec de l’aide.
          </li>
          <li>
            <strong>Autonome :</strong> réalise seul les tâches courantes.
          </li>
          <li>
            <strong>Maîtrise avancée :</strong> traite des situations complexes et peut accompagner
            les autres.
          </li>
        </ul>
        <p className="micro">
          Le niveau est évalué par le conseiller. « À évaluer » préserve une information inconnue ;
          les niveaux ne sont pas des pourcentages.
        </p>
      </details>
      {(['acquired', 'learning'] as const).map((group) => (
        <section className={`skills-editor-group competency-${group}`} key={group}>
          <h4>
            <Icon name={group === 'acquired' ? 'check' : 'clock'} size={18} />
            {group === 'acquired'
              ? 'Compétences déjà acquises'
              : 'Compétences en cours d’acquisition'}
          </h4>
          {!skills.some((skill) => skill.status === group) && (
            <p className="micro">
              {group === 'acquired'
                ? 'Aucune compétence acquise renseignée.'
                : 'Aucune acquisition en cours renseignée.'}
            </p>
          )}
          {skills
            .filter((skill) => skill.status === group)
            .map((skill) => (
              <article className="skill-edit-row" key={skill.id}>
                <div className="skill-edit-heading">
                  <strong>{skill.name}</strong>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Supprimer la compétence ${skill.name}`}
                    onClick={() => {
                      setRemoved({
                        skill,
                        index: skills.findIndex((item) => item.id === skill.id),
                      });
                      onChange(skills.filter((item) => item.id !== skill.id));
                    }}
                  >
                    <Icon name="close" />
                  </button>
                </div>
                <div className="skill-edit-fields">
                  <label>
                    Niveau de {skill.name}
                    <select
                      aria-label={`Niveau de ${skill.name}`}
                      value={skill.level}
                      onChange={(event) =>
                        patch(skill.id, { level: event.target.value as SkillLevel })
                      }
                    >
                      {Object.entries(SKILL_LEVELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    État de {skill.name}
                    <select
                      aria-label={`État de ${skill.name}`}
                      value={skill.status}
                      onChange={(event) =>
                        patch(skill.id, { status: event.target.value as StudentSkill['status'] })
                      }
                    >
                      <option value="acquired">Acquise</option>
                      <option value="learning">En cours d’acquisition</option>
                    </select>
                  </label>
                  <label>
                    Formation associée à {skill.name}
                    <select
                      aria-label={`Formation associée à ${skill.name}`}
                      value={skill.trainingId ?? ''}
                      onChange={(event) =>
                        patch(skill.id, { trainingId: event.target.value || null })
                      }
                    >
                      <option value="">Sans lien avec une formation</option>
                      {calendars.map((calendar) => (
                        <option key={calendar.id} value={calendar.id}>
                          {calendar.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>
            ))}
        </section>
      ))}
      {removed && (
        <div className="skill-undo" role="status">
          <span>{removed.skill.name} supprimée du brouillon.</span>
          <Button
            variant="secondary"
            disabled={skills.some((skill) => skillKey(skill.name) === skillKey(removed.skill.name))}
            onClick={() => {
              const next = [...skills];
              next.splice(Math.min(removed.index, next.length), 0, removed.skill);
              onChange(next);
              setRemoved(null);
            }}
          >
            Annuler la suppression
          </Button>
        </div>
      )}
      <section className="training-skill-suggestions">
        <h4>
          <Icon name="brief" size={18} />
          Compétences visées par la formation
        </h4>
        {training ? (
          <>
            <p>{training.title}</p>
            <p className="micro">
              Propositions du programme : ajoutez seulement celles dont l’acquisition a commencé.
              Aucun acquis ni niveau actuel n’est attribué automatiquement.
            </p>
            {suggestions.map((suggestion) => (
              <div className="training-skill-suggestion" key={suggestion.id}>
                <div>
                  <strong>{suggestion.name}</strong>
                  <span>Objectif : {SKILL_LEVELS[suggestion.targetLevel]}</span>
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    onChange(
                      addSkill(skills, {
                        id: createId(),
                        name: suggestion.name,
                        level: 'unknown',
                        status: 'learning',
                        trainingId: training.id,
                      }),
                    )
                  }
                >
                  <Icon name="plus" />
                  Ajouter en cours d’acquisition
                  <span className="sr-only"> : {suggestion.name}</span>
                </Button>
              </div>
            ))}
            {!suggestions.length && (
              <p className="micro">
                {training.learningSkills?.length
                  ? 'Les compétences proposées sont déjà présentes dans la fiche.'
                  : 'Aucune compétence visée renseignée pour cette formation.'}
              </p>
            )}
          </>
        ) : (
          <p className="micro">
            Sélectionnez une formation pour consulter les compétences qu’elle vise.
          </p>
        )}
      </section>
      <p className="micro">
        Les modifications restent dans le brouillon jusqu’à la validation et la publication de la
        fiche.
      </p>
    </section>
  );
}
