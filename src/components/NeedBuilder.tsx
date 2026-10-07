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
import { DAYS, createId, type Day, type Need } from '../domain/model.ts';
import { Badge, Button, Icon } from './ui.tsx';

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
  const { store, setStore, needId, go, notify } = useApp();
  const editing = location.hash.includes('need=')
    ? store.needs.find((n) => n.id === needId)
    : undefined;
  const [step, setStep] = useState(editing ? 2 : 1);
  const [description, setDescription] = useState(editing?.description ?? '');
  const [brief, setBrief] = useState<Need | null>(editing ?? null);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [dirty, setDirty] = useState(false);
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
      setError('Décrivez vos missions en au moins 20 caractères pour préparer un brief.');
      document.getElementById('need-description')?.focus();
      return;
    }
    const admin = /devis|administr|accueill/i.test(description);
    const communication = /contenu|publication|communication/i.test(description);
    const requiredDays = DAYS.filter((day) => new RegExp(day, 'i').test(description));
    setBrief({
      id: createId(),
      companyId: store.activeCompanyId ?? 'maison-alba',
      mobility: '',
      proposedSkills: admin
        ? ['Accueil client', 'Gestion administrative']
        : communication
          ? ['Rédaction', 'Communication digitale']
          : [],
      proposedDomains: admin
        ? ['Administration', 'Relation client']
        : communication
          ? ['Communication']
          : [],
      title: admin
        ? 'Accueil & gestion administrative'
        : communication
          ? 'Communication & contenus'
          : 'Relation client & missions à préciser',
      description: description.trim(),
      contract: /stag/i.test(description) ? 'Stage' : 'Alternance',
      location: /montpellier/i.test(description) ? 'Montpellier' : '',
      start: '2026-11-02',
      end: '2027-06-30',
      requiredDays,
      licenseRequired: /permis/i.test(description) && !/(pas|sans|non).*permis/i.test(description),
      missions: admin
        ? [
            'Accueillir et renseigner les clients',
            'Préparer et suivre les devis',
            'Accompagner la gestion administrative',
          ]
        : communication
          ? ['Rédiger des contenus', 'Préparer les publications sur les réseaux sociaux']
          : [description.trim()],
      wishes: '',
      schools: ['campus-a'],
      status: 'active',
      validated: false,
      selected: [],
      passed: [],
    });
    setError('');
    setStep(2);
    setConfirmed(false);
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
    if (!brief.location.trim()) {
      setError('Renseignez le lieu des missions.');
      document.getElementById('brief-location')?.focus();
      return;
    }
    if (brief.end < brief.start) {
      setError('La fin de la période doit être postérieure à la date de début.');
      document.getElementById('brief-end')?.focus();
      return;
    }
    if (!confirmed) {
      setError('Confirmez le brief et ses contraintes avant de découvrir les talents.');
      document.getElementById('confirm-brief')?.focus();
      return;
    }
    const validated = { ...brief, validated: true, passed: [] };
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
              <span>2</span> Le brief
            </li>
            <li>
              <span>3</span> Les talents
            </li>
          </ol>
          {step === 1 ? (
            <>
              <div className="page-heading">
                <div>
                  <h1>Que recherchez-vous ?</h1>
                  <p>Racontez-nous le quotidien de la personne qui rejoindra votre équipe.</p>
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
                    <Icon name="shield" size={16} /> Vous confirmez le brief avant toute recherche.
                  </span>
                  <Button type="submit">
                    <Icon name="spark" size={18} /> Préparer mon brief
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
                    <h1>Est-ce bien votre besoin ?</h1>
                    <p>Vérifiez les propositions. Vous gardez la main sur chaque critère.</p>
                  </div>
                </div>
                <form className="panel brief-form" onSubmit={validate}>
                  <Badge tone="sage">
                    <Icon name="spark" size={14} /> Brief proposé · à confirmer
                  </Badge>
                  <label htmlFor="brief-title">
                    Intitulé du besoin
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
                  <label htmlFor="brief-missions">
                    Les missions
                    <textarea
                      id="brief-missions"
                      name="missions"
                      autoComplete="off"
                      rows={4}
                      required
                      value={brief.missions.join('\n')}
                      onChange={(e) => patch({ missions: e.target.value.split('\n') })}
                    />
                    <small>
                      Une mission par ligne. Toute mission suggérée doit être confirmée.
                    </small>
                  </label>
                  <MultiChoice
                    label="Compétences proposées à confirmer"
                    options={SKILL_CHOICES}
                    values={brief.proposedSkills ?? []}
                    onChange={(proposedSkills) => patch({ proposedSkills })}
                  />
                  <MultiChoice
                    label="Domaines envisagés"
                    options={DOMAIN_CHOICES}
                    values={brief.proposedDomains ?? []}
                    onChange={(proposedDomains) => patch({ proposedDomains })}
                  />
                  <p className="micro">
                    Suggestions facultatives à confirmer ; la recherche reste transversale.
                  </p>
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
                  <div className="form-grid">
                    <label>
                      Type de contrat
                      <select
                        name="contract"
                        value={brief.contract}
                        onChange={(e) => patch({ contract: e.target.value })}
                      >
                        <option>Alternance</option>
                        <option>Stage</option>
                      </select>
                    </label>
                    <label>
                      Lieu des missions
                      <ChoiceSelect
                        name="location"
                        value={brief.location}
                        options={LOCATION_CHOICES}
                        allowCustom
                        onChange={(location) => patch({ location })}
                      />
                    </label>
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
                  <fieldset>
                    <legend>Les contraintes obligatoires</legend>
                    <p className="micro">
                      Confirmez uniquement les jours où la présence est impérative.
                    </p>
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
                                  ? [...brief.requiredDays, day as Day]
                                  : brief.requiredDays.filter((d) => d !== day),
                              })
                            }
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                    <label className="checkbox-label">
                      <input
                        name="licenseRequired"
                        type="checkbox"
                        checked={brief.licenseRequired}
                        onChange={(e) => patch({ licenseRequired: e.target.checked })}
                      />{' '}
                      Permis B obligatoire pour les missions
                    </label>
                  </fieldset>
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
                      <strong>Ce brief décrit bien mon besoin.</strong>
                      <small>
                        Je confirme les missions, les dates et les contraintes obligatoires.
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
                      Revenir à ma description
                    </button>
                    <Button type="submit">
                      C’est exactement ça <Icon name="arrow" size={18} />
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
