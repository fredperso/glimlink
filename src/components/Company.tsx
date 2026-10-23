import {
  needProgress,
  suggestedStudents,
  talentAlerts,
  updateRequestStatus,
} from '../domain/company-experience.ts';
import Select from './Select.tsx';
import { readNotifications } from '../domain/notifications.ts';
import ValidatedBrief, { contractLabel } from './ValidatedBrief.tsx';
import { TalentCard } from './TalentCard.tsx';
import SwipeDeck from './SwipeDeck.tsx';
import { useState } from 'react';
import { useApp } from '../context.tsx';
import {
  adviserRequests,
  getCompanies,
  getCompany,
  requestChanges,
  checkAvailability,
  classifyStudent,
  discoveryOrder,
  visibleStudents,
  type Need,
  type Student,
} from '../domain/model.ts';
import { companySites } from '../domain/partners.ts';
import { ChoiceSelect, POSITION_CHOICES, SECTOR_CHOICES } from './Choices.tsx';
import AdviserRelay from './AdviserRelay.tsx';
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
          <small>Votre conseillère référente</small>
        </div>
      </div>
      <p>Du premier talent à l’entretien, je vous accompagne pour trouver la bonne personne.</p>
      <button className="button button-secondary" onClick={() => openModal({ kind: 'contact' })}>
        <Icon name="message" size={17} /> Échanger avec Mathilde
      </button>
      <span className="adviser-school">
        Atelier Campus · Montpellier
        <br />
        Votre contact pour l’inscription et le suivi.
      </span>
    </aside>
  );
}

function NeedRow({ need }: { need: Need }) {
  const { store } = useApp();
  const alerts = talentAlerts(store, need.id).length;
  const count = visibleStudents(store, need).length;
  return (
    <a
      className="need-row"
      href={`#/company/${need.status === 'closed' ? 'requests' : need.validated ? 'discover' : 'new-need'}?need=${need.id}`}
    >
      <span className="need-icon">
        <Icon name="brief" />
      </span>
      <div className="need-row-body">
        <div>
          <h3>{need.title}</h3>
          <Badge tone={need.status === 'active' ? 'green' : 'neutral'}>
            {need.status === 'active' ? 'Actif' : 'Clôturé'}
          </Badge>
        </div>
        <p>
          {contractLabel(need.contract)}
          <span>·</span>
          {need.location}
          <span>·</span>À partir du {dateLabel(need.start)}
        </p>
        <span className="need-progress">{needProgress(store, need)}</span>
        <span className="need-meta">
          {need.status === 'active'
            ? `${count} profils à découvrir · ${need.selected.length} retenus`
            : 'Historique conservé'}
          {alerts > 0 && (
            <Badge tone="green">
              {alerts} nouveau{alerts > 1 ? 'x' : ''} profil{alerts > 1 ? 's' : ''}
            </Badge>
          )}
        </span>
      </div>
      <Icon name="arrow" />
    </a>
  );
}

function Home() {
  const { store, go } = useApp();
  const [description, setDescription] = useState('');
  const needs = store.needs.filter((need) => need.status === 'active').length;
  const completed = store.requests.filter((request) => request.status === 'completed').length;
  const alerts = talentAlerts(store).length;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Bonjour {getCompany(store, store.activeCompanyId).contact.split(' ')[0]}{' '}
            <span className="wave" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p>
            Glimlink lit ce que vous n’avez pas le temps de lire, révèle ce que vous pourriez ne pas
            voir, mais ne choisit jamais à votre place.
          </p>
        </div>
      </div>
      <section className="welcome-banner company-welcome">
        <div className="welcome-copy">
          <Badge tone="forest">
            <Icon name="spark" size={14} /> Recruter, plus simplement
          </Badge>
          <h2>
            Vous avez les missions.
            <br />
            <span className="gradient-text">Ils ont le potentiel.</span>
          </h2>
          <p>Décrivez simplement votre besoin, avec vos mots. Aucun formulaire à remplir.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              go('new-need', undefined, undefined, description.trim());
            }}
          >
            <label htmlFor="home-search" className="sr-only">
              Décrivez votre besoin
            </label>
            <textarea
              id="home-search"
              rows={2}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex. : je recherche quelqu’un pour faire de l’administratif, gérer un portefeuille clients et effectuer des relances commerciales…"
            />
            <Button type="submit">
              <Icon name="spark" size={18} /> Comprendre mon besoin <Icon name="arrow" size={18} />
            </Button>
          </form>
          <span className="welcome-footnote">Pas besoin de rédiger une offre d’emploi.</span>
        </div>
        <div className="welcome-stack" aria-hidden="true">
          {[3, 0, 4].map((variant) => (
            <span key={variant} className={`welcome-stack-card talent-art-${variant}`}>
              <Avatar variant={variant} />
            </span>
          ))}
          <span className="welcome-stack-heart">
            <Icon name="heart" size={28} />
          </span>
        </div>
      </section>
      <section className="home-shortcuts" aria-label="Votre activité">
        <button onClick={() => go('needs')}>
          <Icon name="brief" />
          <span>Besoins en cours</span>
          <strong>{needs}</strong>
          <Icon name="arrow" size={18} />
        </button>
        <button onClick={() => go('requests')}>
          <Icon name="users" />
          <span>Mises en relation effectuées</span>
          <strong>{completed}</strong>
          <Icon name="arrow" size={18} />
        </button>
        <button onClick={() => go('alerts')}>
          <Icon name="bell" />
          <span>
            Talent Alerts<small>Nouveaux profils compatibles</small>
          </span>
          <strong>{alerts}</strong>
          <Icon name="arrow" size={18} />
        </button>
      </section>
      <div className="home-adviser">
        <AdviserCard />
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
          ['closed', 'Besoins clôturés'],
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
              {need.status === 'active' && (
                <>
                  <button className="text-button" onClick={() => go('new-need', need.id)}>
                    <Icon name="brief" size={16} /> Modifier ma recherche
                  </button>
                  {talentAlerts(store, need.id).length > 0 && (
                    <button className="text-button" onClick={() => go('alerts', need.id)}>
                      <Icon name="bell" size={16} /> Talent Alerts ·{' '}
                      {talentAlerts(store, need.id).length}
                    </button>
                  )}
                </>
              )}
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
            {need.status === 'closed' && (
              <details className="closed-brief">
                <summary>Voir le détail du besoin clôturé</summary>
                <ValidatedBrief need={need} />
              </details>
            )}
          </div>
        ))}
        {!list.length && (
          <Empty
            title={
              filter === 'active' ? 'Quel est votre prochain projet ?' : 'Aucun besoin clôturé'
            }
            action={
              filter === 'active' ? (
                <Button onClick={() => go('new-need')}>Comprendre mon besoin</Button>
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

// Découverte V6 : trois espaces sur le même vivier, les profils les plus alignés d’abord.
function Discovery() {
  const { store, needId, openModal, go } = useApp();
  const query = new URLSearchParams(location.hash.split('?')[1]);
  const active = store.needs.filter((n) => n.status === 'active' && n.validated);
  const need = query.has('need') ? store.needs.find((n) => n.id === needId) : active[0];
  const [mode, setMode] = useState<'grid' | 'swipe'>(
    query.get('view') === 'grid' ? 'grid' : 'swipe',
  );
  const [showBrief, setShowBrief] = useState(false);
  if (!need)
    return (
      <Empty
        title="Décrivez un besoin pour découvrir des talents"
        action={<Button onClick={() => go('new-need')}>Comprendre mon besoin</Button>}
      >
        Glimlink reformule votre besoin, vous le confirmez, puis les profils de votre vivier
        apparaissent ici.
      </Empty>
    );
  if (need.status === 'closed' || !need.validated)
    return (
      <Empty
        title="Ce besoin n’est pas ouvert à la découverte"
        action={<Button onClick={() => go('needs')}>Revenir à mes besoins</Button>}
      >
        Le besoin doit être actif et sa reformulation confirmée pour proposer des talents.
      </Empty>
    );
  const ordered = discoveryOrder(store, need);
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
            {contractLabel(need.contract)} · {need.location} · À partir du {dateLabel(need.start)}
          </p>
        </div>
        {active.length > 1 && (
          <label className="need-switch">
            Besoin exploré
            <Select
              value={need.id}
              onChange={(event) => go('discover', event.target.value)}
              aria-label="Changer de besoin"
            >
              {active.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </Select>
          </label>
        )}
      </div>
      <section className="brief-summary">
        <div>
          <Icon name="shield" />
          <strong>Votre besoin confirmé</strong>
          <span>
            {need.missions.length} missions
            {need.requiredDays.length > 0 ? ` · Présence : ${need.requiredDays.join(', ')}` : ''}
            {need.licenseRequired ? ' · Permis obligatoire' : ''}
            {need.levels?.length ? ` · ${need.levels.join(', ')}` : ''}
          </span>
        </div>
        <button
          className="text-button"
          onClick={() => setShowBrief(!showBrief)}
          aria-expanded={showBrief}
        >
          {showBrief ? 'Masquer' : 'Voir le besoin'}
          <Icon name="chevron" size={16} />
        </button>
      </section>
      {showBrief && (
        <section className="panel brief-details">
          <ValidatedBrief need={need} />
          <p className="micro">Toute modification demande une nouvelle confirmation.</p>
          <Button variant="secondary" onClick={() => go('new-need', need.id)}>
            <Icon name="edit" size={16} /> Modifier et reconfirmer
          </Button>
        </section>
      )}
      <div className="discovery-toolbar">
        <div className="discovery-spaces" role="group" aria-label="Espaces de découverte">
          <button
            type="button"
            aria-pressed={mode === 'swipe'}
            className={mode === 'swipe' ? 'active' : ''}
            onClick={() => setMode('swipe')}
          >
            <Icon name="stack" size={18} /> Découvrir
          </button>
          <button
            type="button"
            aria-pressed={mode === 'grid'}
            className={mode === 'grid' ? 'active' : ''}
            onClick={() => setMode('grid')}
          >
            <Icon name="grid" size={18} /> Tous les profils <span>{ordered.length}</span>
          </button>
          <a href={`#/company/selections?need=${need.id}`}>
            <Icon name="heart" size={18} /> Ma sélection <span>{need.selected.length}</span>
          </a>
        </div>
      </div>
      <p className="result-explanation">
        {ordered.length} profil{ordered.length > 1 ? 's' : ''} de votre vivier autorisé, les plus
        directement alignés d’abord. Passer n’écarte personne : chaque profil reste dans « Tous les
        profils ».
      </p>
      {ordered.length === 0 ? (
        <>
          <Empty title="Aucun profil publié dans votre vivier pour le moment">
            Les nouveaux profils validés par le centre arriveront dans Talent Alerts.
          </Empty>
          <AdviserRelay need={need} />
        </>
      ) : mode === 'grid' ? (
        <>
          <div className="talent-grid discovery-grid">
            {ordered.map((student) => (
              <TalentCard key={student.id} student={student} need={need} />
            ))}
          </div>
          {need.selected.length === 0 && <AdviserRelay need={need} />}
        </>
      ) : (
        <SwipeDeck
          key={need.id}
          students={ordered}
          need={need}
          onGrid={() => setMode('grid')}
        />
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

function SelectionSummary({
  student,
  need,
  suggestion = false,
}: {
  student: Student;
  need: Need;
  suggestion?: boolean;
}) {
  const { store, openModal, setStore, notify } = useApp();
  const data = student.published!;
  const training = store.calendars.find((calendar) => calendar.id === data.trainingId);
  function toggle() {
    setStore((previous) => ({
      ...previous,
      needs: previous.needs.map((item) =>
        item.id === need.id
          ? {
              ...item,
              selected: suggestion
                ? [...new Set([...item.selected, student.id])]
                : item.selected.filter((id) => id !== student.id),
            }
          : item,
      ),
    }));
    notify(
      suggestion
        ? `${data.firstName} ajouté à votre sélection`
        : `${data.firstName} retiré de votre sélection`,
    );
  }
  return (
    <article className="selection-summary">
      <button
        className="selection-profile"
        onClick={() => openModal({ kind: 'profile', studentId: student.id, needId: need.id })}
      >
        <Avatar variant={student.avatar} small />
        <span>
          <strong>{data.firstName}</strong>
          <small>{training?.title.split(' · ')[0] ?? 'Formation à vérifier'}</small>
        </span>
        <Icon name="arrow" size={18} />
      </button>
      <button className="text-button" onClick={toggle}>
        <Icon name={suggestion ? 'plus' : 'close'} size={16} />
        {suggestion ? 'Ajouter à ma sélection' : 'Retirer de ma sélection'}
      </button>
    </article>
  );
}
function Selections() {
  const { store, needId, go, openModal, setStore } = useApp();
  const needs = store.needs.filter((need) => need.status === 'active');
  const need = needs.find((item) => item.id === needId) ?? needs[0];
  const selected =
    need?.selected
      .map((id) => store.students.find((student) => student.id === id))
      .filter((student): student is Student => !!student) ?? [];
  const suggestions = need ? suggestedStudents(store, need) : [];
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Vos talents à rencontrer.</h1>
          <p>Ma sélection, organisée par besoin. Cliquez sur un profil pour consulter sa fiche.</p>
        </div>
        <Button variant="secondary" onClick={() => go('requests')}>
          <Icon name="users" /> Mes mises en relation{' '}
          <span className="button-count">{store.requests.length}</span>
        </Button>
      </div>
      {needs.length > 0 && (
        <label className="need-select">
          Pour le besoin
          <Select value={need?.id ?? ''} onChange={(event) => go('selections', event.target.value)}>
            {needs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} · {item.selected.length} retenu(s)
              </option>
            ))}
          </Select>
        </label>
      )}
      {selected.length > 0 ? (
        <>
          <div className="selection-summaries">
            {selected.map((student) =>
              student.status === 'published' && student.published ? (
                <SelectionSummary key={student.id} student={student} need={need} />
              ) : (
                <article className="panel" key={student.id}>
                  <Badge tone="warning">Profil retiré du vivier</Badge>
                  <p>Ce profil n’est plus disponible pour une nouvelle mise en relation.</p>
                  <button
                    className="text-button"
                    onClick={() =>
                      setStore((previous) => ({
                        ...previous,
                        needs: previous.needs.map((item) =>
                          item.id === need.id
                            ? { ...item, selected: item.selected.filter((id) => id !== student.id) }
                            : item,
                        ),
                      }))
                    }
                  >
                    Retirer de ma sélection
                  </button>
                </article>
              ),
            )}
          </div>
          <div className="selection-next">
            <div>
              <h2>Faites le lien avec Mathilde.</h2>
              <p>Votre conseillère échange avec vous et contacte les talents retenus.</p>
            </div>
            <Button
              disabled={!selected.some((student) => student.status === 'published')}
              onClick={() => openModal({ kind: 'request', needId: need.id })}
            >
              Demander une mise en relation <Icon name="arrow" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <Empty
            title="Votre sélection prend forme ici"
            action={
              need ? (
                <Button onClick={() => go('discover', need.id)}>Découvrir les profils</Button>
              ) : (
                <Button onClick={() => go('needs')}>Voir mes besoins</Button>
              )
            }
          >
            Retenez des profils depuis Découvrir ou Tous les profils. La sélection n’a pas de
            plafond et reste propre à chaque besoin.
          </Empty>
          {need && <AdviserRelay need={need} />}
        </>
      )}
      {need && (
        <section className="selection-suggestions">
          <div className="section-heading">
            <div>
              <h2>D’autres profils pour ce besoin</h2>
              <p>Des suggestions du vivier existant, en complément de vos profils retenus.</p>
            </div>
          </div>
          {suggestions.length > 0 ? (
            <div className="selection-summaries">
              {suggestions.map((student) => (
                <SelectionSummary key={student.id} student={student} need={need} suggestion />
              ))}
            </div>
          ) : (
            <p className="notice">
              Aucune autre suggestion compatible pour le moment. Les nouveaux profils arrivent dans
              Talent Alerts.
            </p>
          )}
        </section>
      )}
    </>
  );
}

function Alerts() {
  const { store, setStore, openModal, needId } = useApp();
  const scopedAlerts = location.hash.includes('need=')
    ? store.alerts.filter((alert) => alert.needId === needId)
    : store.alerts;
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
                scopedAlerts.map((alert) => alert.id),
              ),
            )
          }
        >
          <Icon name="check" /> Tout marquer comme lu
        </Button>
      </div>
      <div className="alert-list">
        {scopedAlerts.map((alert) => {
          const need = store.needs.find((n) => n.id === alert.needId);
          const student = store.students.find((s) => s.id === alert.studentId);
          const available =
            !!need &&
            visibleStudents(store, need).some(
              (s) => s.id === student?.id && classifyStudent(store, s, need) === 'main',
            );
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
                  {!alert.read && available && <Badge tone="green">Nouveau</Badge>}
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
        {!scopedAlerts.length && (
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
  const { store, setStore, notify, openModal, role, needId } = useApp();
  const adviser = requestedAdviser && role === 'adviser';
  const statuses = {
    received: 'Demande reçue',
    contacting: 'Prise de contact en cours',
    meeting: 'Entretien à organiser',
    completed: 'Mise en relation effectuée',
  };
  const requests = (adviser ? adviserRequests(store) : store.requests).filter(
    (request) => adviser || !location.hash.includes('need=') || request.needId === needId,
  );
  return (
    <div className="request-list">
      {requests.map((request) => {
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
                    disabled={request.status === 'completed'}
                    onChange={(e) => {
                      const status = e.target.value as typeof request.status;
                      setStore((prev) => updateRequestStatus(prev, request.id, status));
                      notify(
                        status === 'completed'
                          ? 'Mise en relation effectuée. Le besoin est clôturé.'
                          : 'Suivi de la demande mis à jour',
                      );
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
      {!requests.length && (
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

// Mon profil (V6 §2-3) : coordonnées professionnelles et sites, dont le lieu prérempli des besoins.
function CompanyProfile() {
  const { store, setStore, notify } = useApp();
  const company = getCompany(store, store.activeCompanyId);
  const [draft, setDraft] = useState({ ...company, sites: companySites(company) });
  const patch = (value: Partial<typeof draft>) => setDraft((prev) => ({ ...prev, ...value }));
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Mon profil entreprise.</h1>
          <p>Ces informations aident votre conseiller et préremplissent le lieu de vos besoins.</p>
        </div>
      </div>
      <form
        className="panel company-profile"
        onSubmit={(event) => {
          event.preventDefault();
          const sites = draft.sites.map((site) => site.trim()).filter(Boolean);
          setStore((prev) => ({
            ...prev,
            companies: getCompanies(prev).map((item) =>
              item.id === company.id
                ? { ...item, ...draft, sites, location: sites[0] ?? item.location }
                : item,
            ),
          }));
          notify('Profil entreprise enregistré.');
        }}
      >
        <h2>Coordonnées professionnelles</h2>
        <div className="form-grid">
          <label>
            Raison sociale
            <input
              name="name"
              autoComplete="organization"
              required
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </label>
          <label>
            SIRET
            <input
              name="siret"
              inputMode="numeric"
              autoComplete="off"
              value={draft.siret ?? ''}
              onChange={(e) => patch({ siret: e.target.value })}
            />
          </label>
          <label>
            Secteur
            <ChoiceSelect
              name="sector"
              options={SECTOR_CHOICES}
              allowCustom
              value={draft.sector}
              onChange={(sector) => patch({ sector })}
            />
          </label>
          <label>
            Contact principal
            <input
              name="contact"
              autoComplete="name"
              value={draft.contact}
              onChange={(e) => patch({ contact: e.target.value })}
            />
          </label>
          <label>
            Fonction
            <ChoiceSelect
              name="position"
              options={POSITION_CHOICES}
              allowCustom
              value={draft.position}
              onChange={(position) => patch({ position })}
            />
          </label>
          <label>
            E-mail professionnel
            <input
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={draft.email}
              onChange={(e) => patch({ email: e.target.value })}
            />
          </label>
          <label>
            Téléphone professionnel
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              value={draft.phone ?? ''}
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </label>
        </div>
        <fieldset className="mission-list">
          <legend>Sites de l’entreprise</legend>
          <p className="micro">
            Le premier site est proposé par défaut pour chaque nouveau besoin ; le lieu reste
            modifiable dans la reformulation.
          </p>
          <ol>
            {draft.sites.map((site, index) => (
              <li key={index}>
                <input
                  aria-label={index === 0 ? 'Site principal' : `Site ${index + 1}`}
                  name="sites"
                  value={site}
                  onChange={(e) =>
                    patch({
                      sites: draft.sites.map((item, i) => (i === index ? e.target.value : item)),
                    })
                  }
                />
                {index === 0 ? (
                  <Badge tone="sage">Principal</Badge>
                ) : (
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Retirer le site ${index + 1}`}
                    onClick={() => patch({ sites: draft.sites.filter((_, i) => i !== index) })}
                  >
                    <Icon name="close" size={16} />
                  </button>
                )}
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="text-button"
            onClick={() => patch({ sites: [...draft.sites, ''] })}
          >
            <Icon name="plus" size={16} /> Ajouter un site
          </button>
        </fieldset>
        <div className="form-footer">
          <span className="micro">
            Les coordonnées des étudiants ne sont jamais visibles ici : la mise en relation passe
            par votre conseiller.
          </span>
          <Button type="submit">
            <Icon name="check" size={17} /> Enregistrer mon profil
          </Button>
        </div>
      </form>
      <div className="home-adviser">
        <AdviserCard />
      </div>
    </>
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
    case 'profile':
      return <CompanyProfile key={store.activeCompanyId} />;
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
