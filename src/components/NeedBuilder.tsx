import Select from './Select.tsx';
import {
  ChoiceSelect,
  MultiChoice,
  REQUIRED_MOBILITY,
  LOCATION_CHOICES,
  SKILL_CHOICES,
  DOMAIN_CHOICES,
} from './Choices.tsx';
import { useEffect, useState, type FormEvent } from 'react';
import { useApp } from '../context.tsx';
import { DAYS, LEVELS, getCompany, type Day, type Need } from '../domain/model.ts';
import { companySites } from '../domain/partners.ts';
import {
  LANGUAGES,
  LANGUAGE_LEVELS,
  MIN_MISSIONS,
  briefMissions,
  nextIntake,
  proposeBrief,
} from '../domain/brief.ts';
import { Badge, Button, Icon, dateLabel } from './ui.tsx';

const examples = [
  [
    'Accueil & administratif',
    'J’ai besoin de quelqu’un pour accueillir mes clients, gérer des devis et m’aider sur l’administratif. Il faudrait qu’il soit présent le vendredi et qu’il ait le permis.',
  ],
  [
    'Relation client',
    'Je cherche un alternant pour conseiller les clients en boutique et suivre les commandes à Montpellier. Une présence le lundi serait utile.',
  ],
  [
    'Communication',
    'Je cherche un stagiaire pour m’aider à rédiger des contenus et préparer nos publications sur les réseaux sociaux à Montpellier.',
  ],
];
export default function NeedBuilder() {
  const { store, setStore, needId, go, notify, description: initialDescription } = useApp();
  const editing = location.hash.includes('need=')
    ? store.needs.find((n) => n.id === needId)
    : undefined;
  const company = getCompany(store, store.activeCompanyId);
  const sites = companySites(company);
  const [step, setStep] = useState(editing ? 2 : 1);
  const [description, setDescription] = useState(editing?.description ?? initialDescription ?? '');
  const [brief, setBrief] = useState<Need | null>(editing ?? null);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [addingDay, setAddingDay] = useState(false);
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
  const propose = (event: FormEvent) => {
    event.preventDefault();
    if (description.trim().length < 20) {
      setError('Décrivez vos missions en au moins 20 caractères pour que Glimlink les comprenne.');
      document.getElementById('need-description')?.focus();
      return;
    }
    setBrief(
      proposeBrief(description, {
        companyId: company.id,
        sites,
        places: LOCATION_CHOICES,
        calendars: store.calendars,
      }),
    );
    setError('');
    setStep(2);
    setConfirmed(false);
    setAddingDay(false);
    setDirty(true);
  };
  const patch = (value: Partial<Need>) => {
    setBrief((prev) => (prev ? { ...prev, ...value } : prev));
    setConfirmed(false);
    setDirty(true);
  };
  const validate = (event: FormEvent) => {
    event.preventDefault();
    if (!brief) return;
    const fail = (message: string, selector: string) => {
      setError(message);
      document.querySelector<HTMLElement>(selector)?.focus();
    };
    if (briefMissions(brief).length < MIN_MISSIONS)
      return fail(
        `Indiquez au moins ${MIN_MISSIONS} missions avant de valider.`,
        '#brief-missions input',
      );
    if (!brief.location.trim())
      return fail('Renseignez le lieu du poste.', '#brief-location [role="combobox"]');
    if (!brief.levels?.length)
      return fail('Choisissez au moins un niveau accepté.', 'input[name="levels"]');
    if (brief.end < brief.start)
      return fail('La fin de la période doit être postérieure à la date de début.', '#brief-end');
    if (!confirmed) {
      setError('Confirmez le brief et ses contraintes avant de découvrir les talents.');
      document.getElementById('confirm-brief')?.focus();
      return;
    }
    const validated = {
      ...brief,
      missions: briefMissions(brief),
      validated: true,
      passed: [],
    };
    setStore((prev) => ({
      ...prev,
      needs: editing
        ? prev.needs.map((n) => (n.id === editing.id ? { ...validated, id: editing.id } : n))
        : [validated, ...prev.needs],
    }));
    setDirty(false);
    notify('Brief confirmé. Vous pouvez découvrir les talents.');
    go('discover', editing?.id ?? brief.id);
  };
  return (
    <>
      <a
        className="back-link"
        href="#/company/needs"
        onClick={(event) => {
          if (dirty && !window.confirm('Quitter sans enregistrer ce brief ?'))
            event.preventDefault();
        }}
      >
        ‹ Mes besoins
      </a>
      <div className="builder-layout">
        <section>
          <ol className="progress-steps" aria-label="Étapes du besoin">
            <li className={step === 1 ? 'current' : 'done'}>
              <span>{step > 1 ? <Icon name="check" size={14} /> : '1'}</span> Votre besoin
            </li>
            <li className={step === 2 ? 'current' : ''}>
              <span>2</span> Vérification
            </li>
            <li>
              <span>3</span> Les talents
            </li>
          </ol>
          {step === 1 ? (
            <>
              <div className="page-heading">
                <div>
                  <h1>Quel profil recherchez-vous ?</h1>
                  <p>Décrivez simplement votre besoin, avec vos mots. Pas besoin de rédiger une
                    offre d’emploi : Glimlink s’occupe du reste.</p>
                </div>
              </div>
              <form onSubmit={propose} className="panel need-description-panel">
                <label htmlFor="need-description">Les missions, avec vos mots</label>
                <textarea
                  id="need-description"
                  name="description"
                  autoComplete="off"
                  rows={7}
                  maxLength={3000}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setDirty(true);
                    setError('');
                  }}
                  placeholder="Par exemple : accueillir mes clients, préparer les devis et m’aider sur l’administratif…"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'builder-error' : 'description-help'}
                />
                <p id="description-help" className="micro">
                  Précisez les missions, le lieu, les dates et les contraintes qui comptent pour
                  vous.
                </p>
                <div className="examples">
                  <strong>Besoin d’inspiration ?</strong>
                  <div>
                    {examples.map(([label, value]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setDescription(value);
                          setDirty(true);
                        }}
                      >
                        {label}
                        <Icon name="plus" size={14} />
                      </button>
                    ))}
                  </div>
                </div>
                {error && (
                  <p className="form-error" id="builder-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="form-footer">
                  <span>
                    <Icon name="shield" size={16} /> Aucun formulaire à remplir : vous vérifiez la
                    reformulation avant toute recherche.
                  </span>
                  <Button type="submit">
                    <Icon name="spark" size={18} /> Comprendre mon besoin <Icon name="arrow" size={18} />
                  </Button>
                </div>
              </form>
              <p className="micro demo-explanation">
                Maquette : le préremplissage est simulé. Relisez et ajustez chaque proposition.
              </p>
            </>
          ) : (
            brief && (
              <>
                <div className="page-heading">
                  <div>
                    <h1>Est-ce que j’ai bien compris ?</h1>
                    <p>
                      Glimlink a reformulé votre besoin. Vérifiez et ajustez : le matching ne
                      démarre qu’après votre confirmation.
                    </p>
                  </div>
                </div>
                <form className="panel brief-form" onSubmit={validate} noValidate>
                  <Badge tone="sage">
                    <Icon name="spark" size={14} /> Reformulation proposée · à confirmer
                  </Badge>
                  <label htmlFor="brief-title">
                    Intitulé proposé
                    <input
                      id="brief-title"
                      name="title"
                      autoComplete="off"
                      value={brief.title}
                      required
                      maxLength={120}
                      onChange={(e) => patch({ title: e.target.value })}
                    />
                  </label>
                  <fieldset id="brief-missions" className="mission-list">
                    <legend>
                      Missions <span className="micro">({MIN_MISSIONS} minimum)</span>
                    </legend>
                    <ol>
                      {brief.missions.map((mission, index) => (
                        <li key={index}>
                          <input
                            aria-label={`Mission ${index + 1}`}
                            name="missions"
                            autoComplete="off"
                            value={mission}
                            maxLength={160}
                            onChange={(e) =>
                              patch({
                                missions: brief.missions.map((item, i) =>
                                  i === index ? e.target.value : item,
                                ),
                              })
                            }
                          />
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`Retirer la mission ${index + 1}`}
                            onClick={() =>
                              patch({ missions: brief.missions.filter((_, i) => i !== index) })
                            }
                          >
                            <Icon name="close" size={16} />
                          </button>
                        </li>
                      ))}
                    </ol>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => patch({ missions: [...brief.missions, ''] })}
                    >
                      <Icon name="plus" size={16} /> Ajouter une mission
                    </button>
                    <p className="micro">
                      {briefMissions(brief).length} mission
                      {briefMissions(brief).length > 1 ? 's' : ''} renseignée
                      {briefMissions(brief).length > 1 ? 's' : ''} · les compétences ne sont pas la
                      seule source : les missions restent lues dans leur ensemble.
                    </p>
                  </fieldset>
                  <MultiChoice
                    label="Compétences déduites des missions"
                    options={SKILL_CHOICES}
                    values={brief.proposedSkills ?? []}
                    onChange={(proposedSkills) => patch({ proposedSkills })}
                  />
                  <div className="form-grid">
                    <label id="brief-location">
                      Lieu du poste
                      <ChoiceSelect
                        name="location"
                        value={brief.location}
                        options={[...new Set([...sites, ...LOCATION_CHOICES])]}
                        allowCustom
                        required
                        onChange={(location) => patch({ location })}
                      />
                      <small>
                        {sites.length
                          ? `Prérempli depuis votre fiche entreprise (${sites.join(', ')}).`
                          : 'Ajoutez vos sites dans Mon profil pour le préremplir.'}
                      </small>
                    </label>
                    <label>
                      Type de contrat
                      <Select
                        name="contract"
                        value={brief.contract}
                        onChange={(e) => patch({ contract: e.target.value })}
                      >
                        <option value="Alternance">Alternance / CPRO</option>
                        <option value="Stage">Stage</option>
                      </Select>
                    </label>
                  </div>
                  <label>
                    Formation suggérée
                    <Select
                      name="suggestedTrainingId"
                      value={brief.suggestedTrainingId ?? ''}
                      onChange={(e) =>
                        patch({ suggestedTrainingId: e.target.value || undefined })
                      }
                    >
                      <option value="">Aucune préférence</option>
                      {store.calendars.map((calendar) => (
                        <option key={calendar.id} value={calendar.id}>
                          {calendar.title.split(' · ')[0]}
                        </option>
                      ))}
                    </Select>
                    <small>Une suggestion : la recherche reste ouverte aux autres formations.</small>
                  </label>
                  <fieldset>
                    <legend>Niveaux acceptés</legend>
                    <div className="day-toggles">
                      {LEVELS.map((level) => (
                        <label
                          key={level}
                          className={brief.levels?.includes(level) ? 'checked' : ''}
                        >
                          <input
                            type="checkbox"
                            name="levels"
                            checked={!!brief.levels?.includes(level)}
                            onChange={(e) =>
                              patch({
                                levels: e.target.checked
                                  ? LEVELS.filter(
                                      (item) => item === level || brief.levels?.includes(item),
                                    )
                                  : (brief.levels ?? []).filter((item) => item !== level),
                              })
                            }
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="presence-constraint">
                    <legend>Présence obligatoire</legend>
                    {brief.requiredDays.length ? (
                      <div className="constraint-detected">
                        <Icon name="calendar" />
                        <div>
                          <strong>
                            Présence obligatoire le{' '}
                            {brief.requiredDays.map((day) => day.toLowerCase()).join(' et le ')}
                          </strong>
                          <p>
                            Cette contrainte sera comparée aux calendriers des formations. Retirez
                            un jour si la présence n’est pas impérative.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="notice">
                        <Icon name="info" size={18} /> Aucune présence obligatoire mentionnée : le
                        calendrier n’est pas utilisé pour la recherche. Il reste consultable sur
                        chaque profil.
                      </p>
                    )}
                    {(brief.requiredDays.length > 0 || addingDay) && (
                      <div className="day-toggles">
                        {DAYS.map((day) => (
                          <label
                            key={day}
                            className={brief.requiredDays.includes(day) ? 'checked' : ''}
                          >
                            <input
                              type="checkbox"
                              name="requiredDays"
                              checked={brief.requiredDays.includes(day)}
                              onChange={(e) =>
                                patch({
                                  requiredDays: e.target.checked
                                    ? DAYS.filter(
                                        (item) =>
                                          item === day || brief.requiredDays.includes(item),
                                      )
                                    : brief.requiredDays.filter((d) => d !== (day as Day)),
                                })
                              }
                            />
                            {day}
                          </label>
                        ))}
                      </div>
                    )}
                    {!brief.requiredDays.length && !addingDay && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => setAddingDay(true)}
                      >
                        <Icon name="plus" size={16} /> Ajouter un jour de présence obligatoire
                      </button>
                    )}
                  </fieldset>
                  <fieldset>
                    <legend>Prérequis</legend>
                    <label className="checkbox-label">
                      <input
                        name="licenseRequired"
                        type="checkbox"
                        checked={brief.licenseRequired}
                        onChange={(e) => patch({ licenseRequired: e.target.checked })}
                      />{' '}
                      Permis B obligatoire
                    </label>
                    <label className="checkbox-label">
                      <input
                        name="languageRequired"
                        type="checkbox"
                        checked={!!brief.language}
                        onChange={(e) =>
                          patch(
                            e.target.checked
                              ? { language: LANGUAGES[0], languageLevel: 'B1' }
                              : { language: undefined, languageLevel: undefined },
                          )
                        }
                      />{' '}
                      Langue obligatoire
                    </label>
                    {brief.language && (
                      <div className="form-grid">
                        <label>
                          Langue
                          <Select
                            name="language"
                            value={brief.language}
                            onChange={(e) => patch({ language: e.target.value })}
                          >
                            {LANGUAGES.map((language) => (
                              <option key={language}>{language}</option>
                            ))}
                          </Select>
                        </label>
                        <label>
                          Niveau attendu
                          <Select
                            name="languageLevel"
                            value={brief.languageLevel ?? 'B1'}
                            onChange={(e) => patch({ languageLevel: e.target.value })}
                          >
                            {LANGUAGE_LEVELS.map((level) => (
                              <option key={level}>{level}</option>
                            ))}
                          </Select>
                        </label>
                      </div>
                    )}
                  </fieldset>
                  <fieldset>
                    <legend>Disponibilité</legend>
                    <div className="day-toggles">
                      {(
                        [
                          ['immediate', 'Besoin immédiat'],
                          ['next-intake', 'Prochaine rentrée'],
                        ] as const
                      ).map(([value, text]) => (
                        <label
                          key={value}
                          className={
                            (brief.availability ?? 'immediate') === value ? 'checked' : ''
                          }
                        >
                          <input
                            type="radio"
                            name="availability"
                            checked={(brief.availability ?? 'immediate') === value}
                            onChange={() =>
                              patch({
                                availability: value,
                                ...(value === 'next-intake'
                                  ? nextIntake(new Date().toISOString().slice(0, 10))
                                  : {
                                      start: new Date().toISOString().slice(0, 10),
                                      end: '2027-06-30',
                                    }),
                              })
                            }
                          />
                          {text}
                        </label>
                      ))}
                    </div>
                    <details className="brief-period">
                      <summary>
                        Période : {dateLabel(brief.start)} – {dateLabel(brief.end)}
                      </summary>
                      <div className="form-grid">
                        <label>
                          Date de début
                          <input
                            name="start"
                            type="date"
                            value={brief.start}
                            required
                            onChange={(e) => patch({ start: e.target.value })}
                          />
                        </label>
                        <label htmlFor="brief-end">
                          Fin de la période recherchée
                          <input
                            id="brief-end"
                            name="end"
                            type="date"
                            value={brief.end}
                            required
                            min={brief.start}
                            onChange={(e) => patch({ end: e.target.value })}
                          />
                        </label>
                      </div>
                    </details>
                  </fieldset>
                  <details className="brief-more">
                    <summary>Affiner : mobilité, domaines et critères souhaitables</summary>
                    <label>
                      Mobilité demandée
                      <ChoiceSelect
                        name="mobility"
                        options={REQUIRED_MOBILITY}
                        value={brief.mobility ?? ''}
                        placeholder="À préciser"
                        onChange={(mobility) => patch({ mobility })}
                      />
                    </label>
                    <MultiChoice
                      label="Domaines envisagés"
                      options={DOMAIN_CHOICES}
                      values={brief.proposedDomains ?? []}
                      onChange={(proposedDomains) => patch({ proposedDomains })}
                    />
                    <label>
                      Les critères souhaitables
                      <textarea
                        name="wishes"
                        autoComplete="off"
                        rows={2}
                        value={brief.wishes}
                        onChange={(e) => patch({ wishes: e.target.value })}
                        placeholder="Une première expérience, un outil particulier…"
                      />
                      <small>Ils restent distincts des contraintes obligatoires.</small>
                    </label>
                  </details>
                  <label className="confirmation-box">
                    <input
                      id="confirm-brief"
                      name="confirmed"
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => {
                        setConfirmed(e.target.checked);
                        setError('');
                      }}
                    />
                    <span>
                      <strong>Cette reformulation décrit bien mon besoin.</strong>
                      <small>
                        Je confirme les missions, le lieu, les niveaux et les contraintes
                        obligatoires.
                      </small>
                    </span>
                  </label>
                  {error && (
                    <p role="alert" className="form-error" id="builder-error">
                      {error}
                    </p>
                  )}
                  <div className="form-footer">
                    <button type="button" className="text-button" onClick={() => setStep(1)}>
                      Modifier ma demande
                    </button>
                    <Button type="submit">
                      Oui, c’est bien ça <Icon name="arrow" size={18} />
                    </Button>
                  </div>
                </form>
              </>
            )
          )}
        </section>
        <aside className="builder-help">
          <div className="builder-symbol">
            <Icon name="spark" size={42} />
          </div>
          <h2>
            Le potentiel n’a pas
            <br />
            qu’un seul diplôme.
          </h2>
          <p>
            Décrivez les missions plutôt qu’une formation. Nous explorons les parcours adaptés dans
            votre vivier autorisé.
          </p>
          <div className="help-rule">
            <Icon name="check" />
            <span>Pas d’offre à rédiger</span>
          </div>
          <div className="help-rule">
            <Icon name="check" />
            <span>Des contraintes expliquées</span>
          </div>
          <div className="help-rule">
            <Icon name="check" />
            <span>Votre conseillère à vos côtés</span>
          </div>
        </aside>
      </div>
    </>
  );
}
