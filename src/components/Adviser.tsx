import Calendars from './CalendarsPage.tsx';
import { useState } from 'react';
import { useApp } from '../context.tsx';
import { Avatar, Badge, Button, Empty, Icon, dateLabel } from './ui.tsx';
import { RequestList } from './Company.tsx';
import {
  adviserNeeds,
  adviserRequests,
  getCompanies,
  getCompany,
  pendingCorrections,
} from '../domain/model.ts';
import ValidatedBrief from './ValidatedBrief.tsx';

function Students({ preview = false }: { preview?: boolean }) {
  const { store, openModal } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(() => {
    const requested = new URLSearchParams(location.hash.split('?')[1]).get('status');
    return requested && ['draft', 'published', 'withdrawn', 'pending'].includes(requested)
      ? requested
      : 'all';
  });
  const [training, setTraining] = useState('all');
  const list = store.students.filter(
    (s) =>
      s.school === 'campus-a' &&
      (status === 'all' || (status === 'pending' ? pendingCorrections(s) : s.status === status)) &&
      (training === 'all' || s.draft.trainingId === training) &&
      `${s.draft.firstName} ${s.personalDetails?.lastName ?? ''} ${s.draft.skills.map((skill) => skill.name).join(' ')}`
        .toLocaleLowerCase('fr')
        .includes(query.toLocaleLowerCase('fr')),
  );
  return (
    <>
      {!preview && (
        <>
          <div className="page-heading">
            <div>
              <h1>Le potentiel se cultive ici.</h1>
              <p>Vérifiez, enrichissez et publiez les fiches de votre vivier.</p>
            </div>
            <Button onClick={() => openModal({ kind: 'import' })}>
              <Icon name="upload" /> Importer un CV
            </Button>
          </div>
          <div className="filter-bar">
            <label className="search-field">
              <Icon name="search" />
              <span className="sr-only">Rechercher un talent ou une compétence</span>
              <input
                name="search"
                autoComplete="off"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un prénom, une compétence…"
              />
            </label>
            <label>
              <span className="sr-only">Statut des profils</span>
              <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="pending">Toutes les corrections à valider</option>
                <option value="draft">Nouveaux brouillons</option>
                <option value="published">Profils publiés</option>
                <option value="withdrawn">Profils retirés</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Formation des profils</span>
              <select
                name="training"
                value={training}
                onChange={(e) => setTraining(e.target.value)}
              >
                <option value="all">Toutes les formations</option>
                {store.calendars
                  .filter((c) => c.school === 'campus-a')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </>
      )}
      <div className="student-list">
        {(preview ? list.filter(pendingCorrections).slice(0, 3) : list).map((student) => (
          <article key={student.id} className="student-row">
            <Avatar variant={student.avatar} small />
            <div className="student-row-info">
              <h3>
                {student.draft.firstName} {student.personalDetails?.lastName}
              </h3>
              <p>
                {store.calendars.find((c) => c.id === student.draft.trainingId)?.title ??
                  'Formation à renseigner'}
              </p>
              <span>
                {student.draft.skills
                  .map(
                    (skill) => `${skill.name}${skill.status === 'learning' ? ' (en cours)' : ''}`,
                  )
                  .join(' · ')}
              </span>
            </div>
            <Badge
              tone={
                student.status === 'published'
                  ? 'green'
                  : student.status === 'draft'
                    ? 'warning'
                    : 'neutral'
              }
            >
              {student.status === 'published'
                ? pendingCorrections(student)
                  ? 'Corrections à valider'
                  : 'Publié'
                : student.status === 'draft'
                  ? 'À valider'
                  : 'Retiré'}
            </Badge>
            <button
              className="button button-secondary"
              onClick={() => openModal({ kind: 'student', studentId: student.id })}
            >
              {student.status === 'draft' ? 'Vérifier la fiche' : 'Ouvrir la fiche'}
              <Icon name="arrow" size={16} />
            </button>
          </article>
        ))}
        {!list.length && (
          <Empty title="Aucun talent avec ces filtres">
            Essayez un autre prénom, une autre compétence ou un autre statut.
          </Empty>
        )}
      </div>
    </>
  );
}

function Home() {
  const { store, openModal, go } = useApp();
  const students = store.students.filter((s) => s.school === 'campus-a');
  const published = students.filter((s) => s.status === 'published').length;
  const drafts = students.filter(pendingCorrections).length;
  const requests = adviserRequests(store).filter((r) => r.status === 'received').length;
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="greeting">
            <span className="greeting-dot" /> Atelier Campus · Votre périmètre
          </div>
          <h1>
            Bonjour Mathilde
            <span className="wave" aria-hidden="true">
              {' '}
              ✳
            </span>
          </h1>
          <p>Des profils à faire émerger. Des rencontres à accompagner.</p>
        </div>
        <Button onClick={() => openModal({ kind: 'import' })}>
          <Icon name="upload" /> Importer un CV
        </Button>
      </div>
      <section className="adviser-banner">
        <div>
          <Badge tone="forest">L’humain fait le lien</Badge>
          <h2>
            Vous connaissez leurs talents.
            <br />
            Aidez-les à trouver leur place.
          </h2>
          <p>La fiche validée est la référence. Le calendrier rend la rencontre possible.</p>
        </div>
        <div className="adviser-banner-art" aria-hidden="true">
          <Avatar variant={2} />
          <Avatar variant={0} />
          <Avatar variant={1} />
          <span>
            <Icon name="shield" size={32} />
          </span>
        </div>
      </section>
      <div className="metrics">
        <button onClick={() => go('students')}>
          <Icon name="users" />
          <strong>{published}</strong>
          <span>Profils en ligne</span>
          <small>Fiches validées de votre vivier</small>
        </button>
        <button
          onClick={() => {
            location.hash = '/adviser/students?status=pending';
          }}
        >
          <Icon name="file" />
          <strong>{drafts}</strong>
          <span>Correction{drafts > 1 ? 's' : ''} à vérifier</span>
          <small>Votre validation est nécessaire</small>
        </button>
        <button onClick={() => go('requests')}>
          <Icon name="message" />
          <strong>{requests}</strong>
          <span>Demande{requests > 1 ? 's' : ''} à traiter</span>
          <small>Les entreprises attendent votre retour</small>
        </button>
      </div>
      <div className="section-heading">
        <div>
          <h2>À vous de faire émerger le potentiel</h2>
          <p>Les données proposées restent privées avant votre validation.</p>
        </div>
        <a href="#/adviser/students" className="text-button">
          Tout le vivier <Icon name="arrow" size={16} />
        </a>
      </div>
      <Students preview />
      <div className="section adviser-bottom-grid">
        <section className="panel">
          <div className="section-heading">
            <h2>Les formations de votre vivier</h2>
            <Icon name="calendar" />
          </div>
          {store.calendars
            .filter((c) => c.school === 'campus-a')
            .map((c) => (
              <button
                className="training-row"
                key={c.id}
                onClick={() => openModal({ kind: 'calendar', calendarId: c.id })}
              >
                <span>
                  <strong>{c.title.split(' · ')[0]}</strong>
                  <small>
                    {
                      students.filter(
                        (s) => s.status === 'published' && s.published?.trainingId === c.id,
                      ).length
                    }{' '}
                    profils publiés ·{' '}
                    {c.mode === 'weekly'
                      ? `Cours : ${c.courseDays.join(', ')}`
                      : 'Rythme à vérifier'}
                  </small>
                </span>
                <Icon name="edit" size={17} />
              </button>
            ))}
        </section>
        <section className="panel">
          <div className="section-heading">
            <h2>Les besoins de vos partenaires</h2>
            <Icon name="brief" />
          </div>
          {adviserNeeds(store)
            .filter((n) => n.status === 'active')
            .map((n) => (
              <div className="partner-need" key={n.id}>
                <Badge tone="green">Actif</Badge>
                <h3>{n.title}</h3>
                <p>
                  {getCompany(store, n.companyId).name} · {n.contract} · {n.location}
                </p>
              </div>
            ))}
        </section>
      </div>
    </>
  );
}

function Needs() {
  const { store, openModal } = useApp();
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Les projets de vos partenaires.</h1>
          <p>Consultez les briefs validés et les contraintes de recrutement.</p>
        </div>
      </div>
      <div className="calendar-grid">
        {store.needs
          .filter((n) => n.schools.includes('campus-a'))
          .map((n) => (
            <article className="panel adviser-need" key={n.id}>
              <Badge tone={n.status === 'active' ? 'green' : 'neutral'}>
                {n.status === 'active' ? 'Actif' : 'Fermé'}
              </Badge>
              <h2>{n.title}</h2>
              <p>
                {getCompany(store, n.companyId).name} · {n.contract} · {n.location}
              </p>
              <ValidatedBrief need={n} />
              <div className="skill-tags">
                {n.requiredDays.map((day) => (
                  <span key={day}>{day} obligatoire</span>
                ))}
                {n.licenseRequired && <span>Permis B obligatoire</span>}
              </div>
              <p>
                {dateLabel(n.start)} au {dateLabel(n.end)}
              </p>
              <p className="micro">
                {n.selected.length} profils retenus par l’entreprise · Brief confirmé
              </p>
              <Button
                variant="secondary"
                onClick={() =>
                  openModal({ kind: 'contact', companyId: n.companyId ?? 'maison-alba' })
                }
              >
                Préparer un échange
              </Button>
            </article>
          ))}
      </div>
    </>
  );
}

function Companies() {
  const { store, openModal } = useApp();
  const [query, setQuery] = useState('');
  const companies = getCompanies(store).filter((company) =>
    `${company.name} ${company.sector} ${company.location} ${company.contact}`
      .toLocaleLowerCase('fr')
      .includes(query.toLocaleLowerCase('fr').trim()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Des partenaires, des opportunités.</h1>
          <p>L’accès au vivier commence par une invitation du centre.</p>
        </div>
        <Button onClick={() => openModal({ kind: 'invite' })}>
          <Icon name="plus" /> Inviter une entreprise
        </Button>
      </div>
      <div className="filter-bar">
        <label className="search-field">
          <Icon name="search" />
          <span className="sr-only">Rechercher une entreprise partenaire</span>
          <input
            name="companySearch"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une entreprise, un secteur, une ville…"
          />
        </label>
        <span className="micro">
          {companies.length} entreprise{companies.length > 1 ? 's' : ''} partenaire
          {companies.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="partner-company-list">
        {companies.map((company) => (
          <article className="panel company-card" key={company.id}>
            <span className="company-mark" aria-hidden="true">
              {company.mark}
            </span>
            <div>
              <Badge tone={company.status && company.status !== 'active' ? 'warning' : 'green'}>
                {company.status === 'invited'
                  ? 'Invitation préparée'
                  : company.status === 'verification'
                    ? 'E-mail à vérifier'
                    : 'Compte activé'}
              </Badge>
              <h2>{company.name}</h2>
              <p>
                {company.sector} · {company.location}
              </p>
              <p>
                {company.contact} · {company.position}
              </p>
              <span className="micro">Vivier autorisé : Atelier Campus · 1 utilisateur</span>
            </div>
            <Button
              variant="secondary"
              onClick={() => openModal({ kind: 'contact', companyId: company.id })}
            >
              Contacter l’entreprise
            </Button>
            {(company.id === 'maison-alba' ||
              company.status === 'invited' ||
              company.status === 'verification') && (
              <Button
                variant="secondary"
                onClick={() => openModal({ kind: 'activation', companyId: company.id })}
              >
                Voir le parcours d’invitation
              </Button>
            )}
          </article>
        ))}
        {!companies.length && (
          <Empty title="Aucune entreprise avec cette recherche">
            Essayez un autre nom, un secteur d’activité ou une ville.
          </Empty>
        )}
      </div>
    </>
  );
}

export default function Adviser() {
  const { view } = useApp();
  switch (view) {
    case 'students':
      return <Students key={location.hash} />;
    case 'calendars':
      return <Calendars />;
    case 'needs':
      return <Needs />;
    case 'requests':
      return (
        <>
          <div className="page-heading">
            <div>
              <h1>Vous faites la rencontre.</h1>
              <p>Retrouvez le brief, les talents choisis et les points à vérifier.</p>
            </div>
          </div>
          <RequestList adviser />
        </>
      );
    case 'companies':
      return <Companies />;
    default:
      return <Home />;
  }
}
