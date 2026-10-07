import Select from './Select.tsx';
import { readNotifications } from '../domain/notifications.ts';
import ValidatedBrief from './ValidatedBrief.tsx';
import { TalentCard } from './TalentCard.tsx';
import SwipeDeck from './SwipeDeck.tsx';
import { useState } from 'react';
import { useApp } from '../context.tsx';
import {
  adviserRequests,
  getCompany,
  relaxationSuggestions,
  requestChanges,
  checkAvailability,
  classifyStudent,
  visibleStudents,
  type Need,
  type Student,
} from '../domain/model.ts';
import { Avatar, Badge, Button, Empty, Icon, dateLabel } from './ui.tsx';

export function AdviserCard() {
  const { openModal } = useApp();
  return (
    <aside className="adviser-card">
      <div className="adviser-card-heading">
        <span className="adviser-avatar">
          MJ
          <span />
        </span>
        <div>
          <strong>Mathilde JEANNE</strong>
          <small>Votre conseillère formation</small>
        </div>
      </div>
      <p>Du premier talent à l’entretien, je vous accompagne pour trouver la bonne personne.</p>
      <button className="button button-secondary" onClick={() => openModal({ kind: 'contact' })}>
        <Icon name="message" size={17} /> Échanger avec Mathilde
      </button>
      <span className="adviser-school">Atelier Campus · Montpellier</span>
    </aside>
  );
}

function NeedRow({ need }: { need: Need }) {
  const { store } = useApp();
  const count = visibleStudents(store, need).filter(
    (s) => classifyStudent(store, s, need) === 'main',
  ).length;
  return (
    <a className="need-row" href={`#/company/discover?need=${need.id}`}>
      <span className="need-icon">
        <Icon name="brief" />
      </span>
      <div className="need-row-body">
        <div>
          <h3>{need.title}</h3>
          <Badge tone={need.status === 'active' ? 'green' : 'neutral'}>
            {need.status === 'active' ? 'Actif' : 'Fermé'}
          </Badge>
        </div>
        <p>
          {need.contract}
          <span>·</span>
          {need.location}
          <span>·</span>À partir du {dateLabel(need.start)}
        </p>
        <span className="need-meta">
          {count} talents à explorer <i /> {need.selected.length} dans votre sélection
        </span>
      </div>
      <Icon name="arrow" />
    </a>
  );
}

function DiscoveryViewSwitch({
  mode,
  onChange,
}: {
  mode: 'grid' | 'swipe';
  onChange: (mode: 'grid' | 'swipe') => void;
}) {
  return (
    <div className="view-switch" aria-label="Affichage des candidats">
      <button
        aria-label="Affichage carte par carte"
        aria-pressed={mode === 'swipe'}
        className={mode === 'swipe' ? 'active' : ''}
        onClick={() => onChange('swipe')}
      >
        <Icon name="stack" size={18} /> Swipe
      </button>
      <button
        aria-label="Affichage en grille"
        aria-pressed={mode === 'grid'}
        className={mode === 'grid' ? 'active' : ''}
        onClick={() => onChange('grid')}
      >
        <Icon name="grid" size={18} /> Grille
      </button>
    </div>
  );
}

function Home() {
  const { store, go, openModal } = useApp();
  const [mode, setMode] = useState<'grid' | 'swipe'>('swipe');
  const needs = store.needs.filter((n) => n.status === 'active');
  const need = needs[0];
  const candidates = need
    ? visibleStudents(store, need).filter((s) => classifyStudent(store, s, need) === 'main')
    : [];
  const alerts = store.alerts.filter(
    (a) => !a.read && store.needs.some((n) => n.id === a.needId && n.status === 'active'),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="greeting">
            <span className="greeting-dot" /> Votre prochaine rencontre commence ici
          </div>
          <h1>
            Bonjour {getCompany(store, store.activeCompanyId).contact.split(' ')[0]}
            <span className="wave" aria-hidden="true">
              {' '}
              ✳
            </span>
          </h1>
          <p>Des talents à découvrir. Une conseillère pour vous accompagner.</p>
        </div>
        <span className="date-chip">
          <Icon name="calendar" size={16} /> {dateLabel('2026-10-07')}
        </span>
      </div>
      <section className="welcome-banner">
        <div className="welcome-copy">
          <Badge tone="forest">
            <Icon name="spark" size={14} /> Recruter, plus simplement
          </Badge>
          <h2>
            Vous avez les missions.
            <br />
            Ils ont le potentiel.
          </h2>
          <p>
            Parlez-nous de votre besoin. Découvrez les talents
            <br className="desktop-only" /> qui pourraient faire grandir votre équipe.
          </p>
          <Button onClick={() => go('new-need')}>
            <Icon name="plus" size={18} /> Décrire mon besoin <Icon name="arrow" size={18} />
          </Button>
          <span className="welcome-footnote">Pas besoin de rédiger une offre d’emploi.</span>
        </div>
        <div className="constellation" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="orbit orbit-three" />
          <div className="floating-talent float-one">
            <Avatar variant={0} small />
            <span>
              Sophie<small>Gestion de la PME</small>
            </span>
            <i>92%</i>
          </div>
          <div className="connection-line" />
          <div className="floating-center">
            <Icon name="spark" size={32} />
          </div>
          <div className="floating-talent float-two">
            <Avatar variant={1} small />
            <span>
              Lucas<small>Relation client</small>
            </span>
            <i>86%</i>
          </div>
          <div className="floating-talent float-three">
            <Avatar variant={2} small />
            <span>
              Inès<small>Administration</small>
            </span>
            <Icon name="check" size={18} />
          </div>
          <span className="constellation-dot dot-one" />
          <span className="constellation-dot dot-two" />
        </div>
      </section>
      <div className="dashboard-layout">
        <div>
          <section className="section">
            <div className="section-heading">
              <h2>
                Vos recrutements en cours <span className="round-count">{needs.length}</span>
              </h2>
              <a href="#/company/needs" className="text-button">
                Tous mes besoins <Icon name="arrow" size={16} />
              </a>
            </div>
            <div className="need-list">
              {needs.length ? (
                needs.map((n) => <NeedRow key={n.id} need={n} />)
              ) : (
                <Empty
                  title="Votre premier besoin commence ici"
                  action={<Button onClick={() => go('new-need')}>Décrire mon besoin</Button>}
                >
                  Racontez les missions que vous souhaitez confier.
                </Empty>
              )}
            </div>
          </section>
          {alerts.length > 0 && (
            <a className="alert-strip" href="#/company/alerts">
              <span className="alert-strip-icon">
                <Icon name="bell" />
              </span>
              <div>
                <strong>Une nouvelle rencontre en vue</strong>
                <p>
                  {alerts.length} nouveau{alerts.length > 1 ? 'x' : ''} talent
                  {alerts.length > 1 ? 's' : ''} pour vos besoins actifs.
                </p>
              </div>
              <span className="text-button">
                Découvrir <Icon name="arrow" size={18} />
              </span>
            </a>
          )}
        </div>
        <div className="dashboard-rail">
          <AdviserCard />
          <div className="steps-mini">
            <h3>
              Vous choisissez.
              <br />
              Nous faisons le lien.
            </h3>
            <ol>
              <li>
                <span>1</span>
                <div>
                  <strong>Décrivez votre besoin</strong>
                  <p>Avec vos mots, tout simplement.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Découvrez les talents</strong>
                  <p>Comprenez chaque correspondance.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Faites la rencontre</strong>
                  <p>Votre conseillère organise la suite.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
      {candidates.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Ils pourraient rejoindre votre équipe</h2>
              <p>Pour votre besoin « {need.title} »</p>
            </div>
            <a className="text-button" href={`#/company/discover?need=${need.id}`}>
              Explorer les talents <Icon name="arrow" size={16} />
            </a>
          </div>
          <DiscoveryViewSwitch mode={mode} onChange={setMode} />
          {mode === 'swipe' ? (
            <SwipeDeck
              key={need.id}
              students={candidates}
              need={need}
              onGrid={() => setMode('grid')}
            />
          ) : (
            <div className="talent-grid">
              {candidates.map((s) => (
                <TalentCard key={s.id} student={s} need={need} compact />
              ))}
            </div>
          )}
        </section>
      )}
      <div className="confidence-line">
        <Icon name="shield" size={18} />
        <span>
          Des profils vérifiés par le centre. Des coordonnées protégées. Une relation humaine.
        </span>
        <button className="text-button" onClick={() => openModal({ kind: 'help' })}>
          En savoir plus
        </button>
      </div>
    </>
  );
}

function Needs() {
  const { store, go, setStore, notify } = useApp();
  const [filter, setFilter] = useState('active');
  const [confirm, setConfirm] = useState<string | null>(null);
  const list = store.needs.filter((n) => n.status === filter);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Vos besoins, vos prochaines rencontres.</h1>
          <p>Chaque recrutement a son brief, ses talents et sa sélection.</p>
        </div>
        <Button onClick={() => go('new-need')}>
          <Icon name="plus" /> Nouveau besoin
        </Button>
      </div>
      <div className="tabs" aria-label="État des besoins">
        {[
          ['active', 'Besoins actifs'],
          ['closed', 'Besoins fermés'],
        ].map(([id, label]) => (
          <button
            key={id}
            className={filter === id ? 'active' : ''}
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
          >
            {label} <span>{store.needs.filter((n) => n.status === id).length}</span>
          </button>
        ))}
      </div>
      <div className="need-list standalone">
        {list.map((need) => (
          <div key={need.id}>
            <NeedRow need={need} />
            <div className="need-management">
              {need.status === 'active' ? (
                confirm === need.id ? (
                  <>
                    <span>Fermer ce besoin et arrêter ses alertes ?</span>
                    <button
                      className="text-button danger"
                      onClick={() => {
                        setStore((prev) => ({
                          ...prev,
                          needs: prev.needs.map((n) =>
                            n.id === need.id ? { ...n, status: 'closed' } : n,
                          ),
                        }));
                        setConfirm(null);
                        notify('Besoin fermé. Les alertes sont arrêtées.');
                      }}
                    >
                      Confirmer la fermeture
                    </button>
                    <button className="text-button" onClick={() => setConfirm(null)}>
                      Annuler
                    </button>
                  </>
                ) : (
                  <button className="text-button muted" onClick={() => setConfirm(need.id)}>
                    Fermer le besoin
                  </button>
                )
              ) : (
                <span className="micro">
                  Le brief et l’historique de la sélection sont conservés.
                </span>
              )}
            </div>
          </div>
        ))}
        {!list.length && (
          <Empty
            title={filter === 'active' ? 'Quel est votre prochain projet ?' : 'Aucun besoin fermé'}
            action={
              filter === 'active' ? (
                <Button onClick={() => go('new-need')}>Décrire mon besoin</Button>
              ) : undefined
            }
          >
            Les besoins apparaîtront ici au fil de vos recrutements.
          </Empty>
        )}
      </div>
    </>
  );
}

function Discovery() {
  const { store, needId, setStore, openModal, go, notify } = useApp();
  const [tab, setTab] = useState('main');
  const [mode, setMode] = useState<'grid' | 'swipe'>('swipe');
  const [showBrief, setShowBrief] = useState(false);
  const need = store.needs.find((n) => n.id === needId);
  if (!need || need.status === 'closed' || !need.validated)
    return (
      <Empty
        title="Ce besoin n’est pas ouvert à la découverte"
        action={<Button onClick={() => go('needs')}>Revenir à mes besoins</Button>}
      >
        Le besoin doit être actif et son brief confirmé pour proposer des talents.
      </Empty>
    );
  const all = visibleStudents(store, need);
  const group = (key: string) => all.filter((s) => classifyStudent(store, s, need) === key);
  const current = group(tab).filter((s) => !need.passed.includes(s.id));
  const pass = (student: Student) => {
    setStore((prev) => ({
      ...prev,
      needs: prev.needs.map((n) =>
        n.id === need.id ? { ...n, passed: [...n.passed, student.id] } : n,
      ),
    }));
    notify(`${student.published!.firstName} passé. Vous pouvez revoir les profils passés.`);
  };
  const alternatives = relaxationSuggestions(store, need);
  const blockers = new Map<string, number>();
  for (const student of all)
    for (const check of checkAvailability(
      student.published!,
      store.calendars.find((c) => c.id === student.published!.trainingId),
      need,
    ).filter((check) => check.kind !== 'ok'))
      blockers.set(check.text, (blockers.get(check.text) ?? 0) + 1);
  return (
    <div className={mode === 'swipe' ? 'swipe-discovery' : 'grid-discovery'}>
      <a className="back-link" href="#/company/needs">
        ‹ Mes besoins
      </a>
      <div className="page-heading">
        <div>
          <Badge tone="green">Besoin actif</Badge>
          <h1>{need.title}</h1>
          <p>
            {need.contract} · {need.location} · À partir du {dateLabel(need.start)}
          </p>
        </div>
        <Button variant="secondary" onClick={() => go('selections', need.id)}>
          <Icon name="heart" /> Ma sélection{' '}
          <span className="button-count">{need.selected.length}</span>
        </Button>
      </div>
      <section className="brief-summary">
        <div>
          <Icon name="shield" />
          <strong>Votre brief validé</strong>
          <span>
            {need.missions[0]}
            {need.requiredDays.length > 0 ? ` · Présence : ${need.requiredDays.join(', ')}` : ''}
            {need.licenseRequired ? ' · Permis obligatoire' : ''}
          </span>
        </div>
        <button
          className="text-button"
          onClick={() => setShowBrief(!showBrief)}
          aria-expanded={showBrief}
        >
          {showBrief ? 'Masquer' : 'Voir le brief'}
          <Icon name="chevron" size={16} />
        </button>
      </section>
      {showBrief && (
        <section className="panel brief-details">
          <ValidatedBrief need={need} />
          <p className="micro">Les changements de brief nécessitent une nouvelle confirmation.</p>
          <Button variant="secondary" onClick={() => go('new-need', need.id)}>
            <Icon name="edit" size={16} /> Modifier et reconfirmer
          </Button>
        </section>
      )}
      <div className="discovery-toolbar">
        <div className="tabs discovery-tabs">
          {[
            ['main', 'Pour votre besoin'],
            ['discover', 'À découvrir'],
            ['verify', 'À vérifier'],
            ['conflict', 'Conflits identifiés'],
          ].map(([id, label]) => (
            <button
              className={tab === id ? 'active' : ''}
              key={id}
              onClick={() => {
                setTab(id);
              }}
              aria-pressed={tab === id}
            >
              {id === 'discover' && <Icon name="spark" size={16} />} {label}
              <span>{group(id).length}</span>
            </button>
          ))}
        </div>
        <DiscoveryViewSwitch mode={mode} onChange={setMode} />
      </div>
      <p className="result-explanation">
        {tab === 'discover'
          ? 'Des parcours moins évidents, des compétences qui font le lien avec vos missions.'
          : tab === 'verify'
            ? 'Ces profils nécessitent une vérification du calendrier ou des disponibilités avec votre conseiller.'
            : tab === 'conflict'
              ? 'Ces profils présentent une incompatibilité connue. Elle est expliquée avant toute décision.'
              : `${current.length} talents à explorer, à partir des fiches validées par le centre.`}{' '}
        <span>Scores illustratifs de la maquette.</span>
      </p>
      {current.length || (mode === 'swipe' && group(tab).length) ? (
        mode === 'grid' ? (
          <div className="talent-grid discovery-grid">
            {current.map((s) => (
              <div key={s.id}>
                <TalentCard student={s} need={need} />
                <button className="pass-link" onClick={() => pass(s)}>
                  Passer ce profil
                </button>
              </div>
            ))}
          </div>
        ) : (
          <SwipeDeck
            key={`${need.id}-${tab}`}
            students={group(tab)}
            need={need}
            onGrid={() => setMode('grid')}
          />
        )
      ) : (
        <Empty
          title={
            need.passed.length
              ? 'Vous avez exploré ces talents'
              : 'Pas encore de talent pour ces critères'
          }
          action={
            <div className="empty-actions">
              {need.passed.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStore((prev) => ({
                      ...prev,
                      needs: prev.needs.map((n) => (n.id === need.id ? { ...n, passed: [] } : n)),
                    }));
                    notify('Profils passés de nouveau visibles');
                  }}
                >
                  Revoir les profils passés
                </Button>
              )}
              <Button onClick={() => openModal({ kind: 'contact' })}>
                En parler avec Mathilde
              </Button>
              <Button variant="secondary" onClick={() => go('new-need', need.id)}>
                Ajuster et reconfirmer le brief
              </Button>
            </div>
          }
        >
          <div className="no-match-help">
            <p>
              {group('conflict').length} profil(s) présentent un conflit connu ;{' '}
              {group('verify').length} nécessitent une vérification. {group('discover').length}{' '}
              parcours sont dans « À découvrir ».
            </p>
            {all.length === 0 && (
              <p>Aucun profil publié n’est actuellement disponible dans votre vivier autorisé.</p>
            )}
            {blockers.size > 0 && (
              <ul>
                {[...blockers.entries()].map(([reason, count]) => (
                  <li key={reason}>
                    {reason} : {count} profil(s) concerné(s).
                  </li>
                ))}
              </ul>
            )}
            {group('discover').length > 0 && (
              <Button variant="secondary" onClick={() => setTab('discover')}>
                Explorer les autres parcours
              </Button>
            )}
            {alternatives.map((alternative) => (
              <div className="relaxation-option" key={alternative.label}>
                <strong>{alternative.label}</strong>
                <p>
                  +{alternative.count} profil(s) potentiellement compatible(s), selon les
                  contraintes renseignées. Scores de démonstration.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const relaxedDays = need.requiredDays.filter(
                      (day) => !alternative.need.requiredDays.includes(day),
                    );
                    const wishes = [
                      need.wishes,
                      ...relaxedDays.map((day) => `Présence le ${day.toLowerCase()} souhaitable`),
                      need.licenseRequired && !alternative.need.licenseRequired
                        ? 'Permis B souhaitable'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ; ');
                    setStore((prev) => ({
                      ...prev,
                      needs: prev.needs.map((n) =>
                        n.id === need.id
                          ? {
                              ...n,
                              requiredDays: alternative.need.requiredDays,
                              licenseRequired: alternative.need.licenseRequired,
                              wishes,
                              validated: false,
                            }
                          : n,
                      ),
                    }));
                    go('new-need', need.id);
                  }}
                >
                  Revoir cette proposition et confirmer
                </Button>
              </div>
            ))}
            <p>
              Vérifiez les conflits de cours et les informations manquantes dans les autres onglets.
            </p>
            Vous pouvez envisager d’autres jours de présence ou revoir le permis obligatoire ; aucun
            critère n’est assoupli automatiquement.
          </div>
        </Empty>
      )}
      {need.selected.length > 0 && (
        <div className="selection-dock">
          <div>
            <span className="selection-dock-icon">
              <Icon name="heart" />
            </span>
            <span>
              <strong>
                {need.selected.length} talent{need.selected.length > 1 ? 's' : ''} sélectionné
                {need.selected.length > 1 ? 's' : ''}
              </strong>
              <small>Votre conseillère prend le relais.</small>
            </span>
          </div>
          <Button onClick={() => openModal({ kind: 'request', needId: need.id })}>
            Demander une mise en relation <Icon name="arrow" size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}

function Selections() {
  const { store, needId, go, openModal, setStore, notify } = useApp();
  const needs = store.needs.filter((n) => n.status === 'active');
  const need = needs.find((n) => n.id === needId) ?? needs[0];
  const selected =
    need?.selected
      .map((id) => store.students.find((s) => s.id === id))
      .filter((s): s is Student => !!s) ?? [];
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Vos talents à rencontrer.</h1>
          <p>Une sélection par besoin. Votre conseillère organise la suite.</p>
        </div>
      </div>
      <label className="need-select">
        Pour le besoin
        <Select value={need?.id ?? ''} onChange={(e) => go('selections', e.target.value)}>
          {needs.map((n) => (
            <option key={n.id} value={n.id}>
              {n.title}
            </option>
          ))}
        </Select>
      </label>
      {selected.length ? (
        <>
          <div className="talent-grid">
            {selected.map((s) =>
              s.status === 'published' ? (
                <TalentCard key={s.id} student={s} need={need} />
              ) : (
                <article key={s.id} className="panel">
                  <Badge tone="warning">Profil retiré du vivier</Badge>
                  <h2>{s.published?.firstName}</h2>
                  <p>Ce talent n’est plus disponible pour une nouvelle mise en relation.</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setStore((prev) => ({
                        ...prev,
                        needs: prev.needs.map((n) =>
                          n.id === need.id
                            ? { ...n, selected: n.selected.filter((id) => id !== s.id) }
                            : n,
                        ),
                      }));
                      notify('Profil retiré de la sélection');
                    }}
                  >
                    Retirer de la sélection
                  </Button>
                </article>
              ),
            )}
          </div>
          <div className="selection-next">
            <div>
              <h2>La prochaine étape est humaine.</h2>
              <p>
                Mathilde échange avec vous, vérifie les disponibilités et contacte les étudiants.
              </p>
            </div>
            <Button onClick={() => openModal({ kind: 'request', needId: need.id })}>
              Demander une mise en relation <Icon name="arrow" />
            </Button>
          </div>
        </>
      ) : (
        <Empty
          title="Votre sélection prend forme ici"
          action={
            <Button onClick={() => (need ? go('discover', need.id) : go('new-need'))}>
              {need ? 'Découvrir les talents' : 'Décrire mon besoin'}
            </Button>
          }
        >
          Ajoutez les profils que vous souhaitez rencontrer depuis la découverte.
        </Empty>
      )}
    </>
  );
}

function Alerts() {
  const { store, setStore, openModal } = useApp();
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Les talents arrivent. Vous êtes informé.</h1>
          <p>Chaque alerte est liée à l’un de vos besoins actifs.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() =>
            setStore((prev) =>
              readNotifications(
                prev,
                'company',
                store.alerts.map((alert) => alert.id),
              ),
            )
          }
        >
          <Icon name="check" /> Tout marquer comme lu
        </Button>
      </div>
      <div className="alert-list">
        {store.alerts.map((alert) => {
          const need = store.needs.find((n) => n.id === alert.needId);
          const student = store.students.find((s) => s.id === alert.studentId);
          const available =
            !!need && visibleStudents(store, need).some((s) => s.id === student?.id);
          return (
            <article className={`alert-item ${alert.read ? '' : 'unread'}`} key={alert.id}>
              <Avatar variant={student?.avatar} small />
              <div>
                <div className="alert-title">
                  <h2>
                    {available
                      ? `${student!.published!.firstName} rejoint votre vivier`
                      : 'Une alerte de votre historique'}
                  </h2>
                  {!alert.read && <Badge tone="green">Nouveau</Badge>}
                </div>
                <p>
                  {need?.title ?? 'Besoin fermé'} · {dateLabel(alert.date)}
                </p>
                <span>
                  {available
                    ? 'Profil validé par le centre, à découvrir pour ce besoin.'
                    : 'Ce profil ou ce besoin n’est plus accessible. Votre conseillère peut vous accompagner.'}
                </span>
              </div>
              {available && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStore((prev) => ({
                      ...prev,
                      alerts: prev.alerts.map((a) =>
                        a.id === alert.id ? { ...a, read: true } : a,
                      ),
                    }));
                    openModal({ kind: 'profile', studentId: student!.id, needId: need!.id });
                  }}
                >
                  Voir le profil <Icon name="arrow" size={16} />
                </Button>
              )}
            </article>
          );
        })}
        {!store.alerts.length && (
          <Empty title="Les prochaines rencontres se préparent">
            Vous serez informé lorsqu’un nouveau talent validé correspondra à votre besoin.
          </Empty>
        )}
      </div>
      <p className="micro">
        Dans cette maquette, les alertes sont locales. L’envoi par e-mail sera connecté dans
        l’application.
      </p>
    </>
  );
}

export function RequestList({ adviser: requestedAdviser = false }: { adviser?: boolean }) {
  const { store, setStore, notify, openModal, role } = useApp();
  const adviser = requestedAdviser && role === 'adviser';
  const statuses = {
    received: 'Demande reçue',
    contacting: 'Prise de contact en cours',
    meeting: 'Entretien à organiser',
  };
  return (
    <div className="request-list">
      {(adviser ? adviserRequests(store) : store.requests).map((request) => {
        const need = store.needs.find((n) => n.id === request.needId);
        const students = request.studentIds
          .map((id) => store.students.find((s) => s.id === id))
          .filter((s): s is Student => !!s && (!adviser || s.school === 'campus-a'));
        return (
          <article className="panel request-card" key={request.id}>
            <div className="section-heading">
              <div>
                <Badge tone="green">{statuses[request.status]}</Badge>
                <h2>{need?.title}</h2>
                <p>
                  {adviser
                    ? `${getCompany(store, need?.companyId).name} · ${getCompany(store, need?.companyId).contact}`
                    : 'Votre conseillère : Mathilde JEANNE'}{' '}
                  · {dateLabel(request.date)}
                </p>
              </div>
              <Icon name="users" size={24} />
            </div>
            <div className="requested-students">
              {students.map((s) => (
                <span key={s.id}>
                  <Avatar variant={s.avatar} small />
                  {adviser ? (
                    <button
                      className="text-button"
                      onClick={() => openModal({ kind: 'student', studentId: s.id })}
                    >
                      {s.draft.firstName} {s.personalDetails?.lastName}
                      <Icon name="arrow" size={16} />
                    </button>
                  ) : (
                    (s.published?.firstName ?? 'Profil indisponible')
                  )}
                  {s.status === 'withdrawn' && (
                    <Badge tone="warning">Retiré depuis la sélection</Badge>
                  )}
                </span>
              ))}
            </div>
            {request.message && <blockquote>{request.message}</blockquote>}
            {adviser && requestChanges(store, request).length > 0 && (
              <section className="notice notice-warning">
                <strong>Depuis la demande</strong>
                <ul>
                  {requestChanges(store, request).map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </section>
            )}
            {adviser && need && (
              <ul className="check-list" aria-label="Disponibilités actuelles à vérifier">
                {students
                  .filter((s) => s.status === 'published' && s.published)
                  .flatMap((s) =>
                    checkAvailability(
                      s.published!,
                      store.calendars.find((c) => c.id === s.published!.trainingId),
                      need,
                    )
                      .filter((check) => check.kind !== 'ok')
                      .map((check, index) => (
                        <li className={`check-${check.kind}`} key={`${s.id}-${index}`}>
                          <Icon name="alert" size={17} />
                          <span>
                            {s.published!.firstName} : {check.text}
                          </span>
                          <Badge tone="warning">À contrôler avant contact</Badge>
                        </li>
                      )),
                  )}
              </ul>
            )}
            {adviser && (
              <>
                <details className="request-brief">
                  <summary>Brief validé et contact entreprise</summary>
                  {need && <ValidatedBrief need={need} />}
                  <p>
                    {getCompany(store, need?.companyId).contact} ·{' '}
                    {getCompany(store, need?.companyId).name} ·{' '}
                    <a href={`mailto:${getCompany(store, need?.companyId).email}`}>
                      {getCompany(store, need?.companyId).email}
                    </a>
                    {getCompany(store, need?.companyId).phone &&
                      ` · ${getCompany(store, need?.companyId).phone}`}
                  </p>
                  {request.snapshot && (
                    <details>
                      <summary>Brief au moment de la demande</summary>
                      <ValidatedBrief need={request.snapshot.need} />
                    </details>
                  )}
                </details>
                <div className="form-grid">
                  <label>
                    Date d’entretien envisagée
                    <input
                      type="datetime-local"
                      name="meetingDate"
                      value={request.meetingDate ?? ''}
                      onChange={(e) => {
                        const meetingDate = e.target.value;
                        setStore((prev) => ({
                          ...prev,
                          requests: prev.requests.map((r) =>
                            r.id === request.id ? { ...r, meetingDate } : r,
                          ),
                        }));
                      }}
                    />
                  </label>
                  <label>
                    Compte rendu conseiller
                    <textarea
                      name="followUp"
                      rows={3}
                      value={request.followUp ?? ''}
                      placeholder="Prise de contact, réserves expliquées, prochaines étapes…"
                      onChange={(e) => {
                        const followUp = e.target.value;
                        setStore((prev) => ({
                          ...prev,
                          requests: prev.requests.map((r) =>
                            r.id === request.id ? { ...r, followUp } : r,
                          ),
                        }));
                      }}
                    />
                  </label>
                </div>
                <label className="inline-label">
                  Suivi de la demande
                  <Select
                    value={request.status}
                    onChange={(e) => {
                      const status = e.target.value as typeof request.status;
                      setStore((prev) => ({
                        ...prev,
                        requests: prev.requests.map((r) =>
                          r.id === request.id ? { ...r, status } : r,
                        ),
                      }));
                      notify('Suivi de la demande mis à jour');
                    }}
                  >
                    {Object.entries(statuses).map(([id, text]) => (
                      <option value={id} key={id}>
                        {text}
                      </option>
                    ))}
                  </Select>
                </label>
              </>
            )}
          </article>
        );
      })}
      {!store.requests.length && (
        <Empty
          title={
            adviser
              ? 'Aucune demande à traiter pour le moment'
              : 'Vos rencontres commencent par une sélection'
          }
        >
          Les demandes de mise en relation apparaîtront ici avec les talents retenus et leur suivi.
        </Empty>
      )}
    </div>
  );
}

export default function Company() {
  const { view, store } = useApp();
  switch (view) {
    case 'needs':
      return <Needs />;
    case 'discover':
      return <Discovery key={location.hash} />;
    case 'selections':
      return <Selections />;
    case 'alerts':
      return <Alerts />;
    case 'requests':
      return (
        <>
          <div className="page-heading">
            <div>
              <h1>Du talent à la rencontre.</h1>
              <p>Retrouvez vos demandes et les prochaines étapes avec Mathilde.</p>
            </div>
          </div>
          <RequestList />
        </>
      );
    default:
      return <Home key={store.activeCompanyId} />;
  }
}
