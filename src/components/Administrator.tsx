import { useEffect, useState, type FormEvent } from 'react';
import { useApp } from '../context.tsx';
import { getCompanies, type ManagedUser, type Role } from '../domain/model.ts';
import { addManagedCompany, addManagedUser, getUsers } from '../domain/administration.ts';
import { Button, Icon, Modal } from './ui.tsx';
import Select from './Select.tsx';
import CalendarsPage from './CalendarsPage.tsx';

const roleLabels: Record<Role, string> = {
  admin: 'Administrateur',
  adviser: 'Conseiller',
  company: 'Entreprise',
};
export default function Administrator() {
  const { store, setStore, view, go, openModal, notify } = useApp();
  const [adding, setAdding] = useState<'users' | 'companies' | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [userRole, setUserRole] = useState<Role>('adviser');
  useEffect(() => {
    setQuery('');
    setAdding(null);
  }, [view]);
  const companies = getCompanies(store);
  const users = getUsers(store);
  const start = (kind: 'users' | 'companies') => {
    setAdding(kind);
    setError('');
    setUserRole('adviser');
  };
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();
    const next =
      adding === 'users'
        ? addManagedUser(
            store,
            {
              id: '',
              firstName: field('firstName'),
              lastName: field('lastName'),
              email: field('email'),
              phone: field('phone'),
              address: field('address'),
              role: userRole,
              school: field('school'),
              companyId: field('companyId'),
            } as ManagedUser,
            'admin',
          )
        : addManagedCompany(
            store,
            {
              id: '',
              name: field('name'),
              email: field('email'),
              phone: field('phone'),
              address: field('address'),
              location: field('location'),
              contact: field('contact'),
              position: field('position'),
              sector: field('sector'),
              siret: field('siret'),
              mark: field('name').slice(0, 2).toLowerCase() + '.',
              schools: [field('school')],
              adviserId: field('school') === 'campus-a' ? 'mathilde-jeanne' : undefined,
            },
            'admin',
          );
    if (next === store) {
      setError('Vérifiez les coordonnées, le rattachement et l’absence de doublon d’e-mail.');
      return;
    }
    setStore((previous) =>
      adding === 'users'
        ? { ...previous, users: next.users }
        : { ...previous, companies: next.companies },
    );
    notify(
      adding === 'users'
        ? 'Utilisateur ajouté.'
        : 'Entreprise ajoutée. Son activation reste à effectuer.',
    );
    setAdding(null);
  }
  const match = (text: string) =>
    text.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr'));
  return (
    <>
      {view === 'calendars' ? (
        <CalendarsPage />
      ) : view === 'users' || view === 'companies' ? (
        <>
          <div className="page-heading">
            <div>
              <h1>
                {view === 'users'
                  ? 'Les utilisateurs de votre réseau.'
                  : 'Les entreprises partenaires.'}
              </h1>
              <p>
                {view === 'users'
                  ? 'Retrouvez les rôles, rattachements et coordonnées de votre équipe.'
                  : 'Centralisez les coordonnées des entreprises et de leurs contacts.'}
              </p>
            </div>
            <Button onClick={() => start(view)}>
              <Icon name="plus" />
              {view === 'users' ? 'Ajouter un utilisateur' : 'Ajouter une entreprise'}
            </Button>
          </div>
          <section className="panel admin-directory">
            <label>
              Rechercher
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom, e-mail, téléphone…"
              />
            </label>
            <div className="admin-records">
              {view === 'users'
                ? users
                    .filter((user) =>
                      match(`${user.firstName} ${user.lastName} ${user.email} ${user.phone}`),
                    )
                    .map((user) => (
                      <article key={user.id} className="admin-record">
                        <h2>
                          {user.firstName} {user.lastName}
                        </h2>
                        <p>
                          {roleLabels[user.role]} ·{' '}
                          {user.school === 'campus-a' ? 'Atelier Campus' : 'Campus B'}
                          {user.companyId &&
                            ` · ${companies.find((item) => item.id === user.companyId)?.name}`}
                        </p>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                        <a href={`tel:${user.phone.replace(/ /g, '')}`}>{user.phone}</a>
                        <p>{user.address}</p>
                      </article>
                    ))
                : companies
                    .filter((company) =>
                      match(
                        `${company.name} ${company.contact} ${company.email} ${company.phone ?? ''}`,
                      ),
                    )
                    .map((company) => (
                      <article key={company.id} className="admin-record">
                        <h2>{company.name}</h2>
                        <p>
                          {company.sector} · {company.location}
                        </p>
                        <strong>{company.contact}</strong>
                        <p>{company.position}</p>
                        <a href={`mailto:${company.email}`}>{company.email}</a>
                        {company.phone && (
                          <a href={`tel:${company.phone.replace(/ /g, '')}`}>{company.phone}</a>
                        )}
                        <p>{company.address ?? 'Adresse à compléter'}</p>
                        <small>
                          {company.status === 'invited'
                            ? 'Activation à effectuer'
                            : company.status === 'verification'
                              ? 'Vérification en cours'
                              : 'Partenaire actif'}
                        </small>
                      </article>
                    ))}
            </div>
            {!(view === 'users'
              ? users.some((user) =>
                  match(`${user.firstName} ${user.lastName} ${user.email} ${user.phone}`),
                )
              : companies.some((company) =>
                  match(
                    `${company.name} ${company.contact} ${company.email} ${company.phone ?? ''}`,
                  ),
                )) && <p>Aucun résultat.</p>}
          </section>
        </>
      ) : (
        <>
          <div className="page-heading">
            <div>
              <span className="eyebrow">ADMINISTRATION</span>
              <h1>Votre réseau, bien organisé.</h1>
              <p>
                Préparez les formations et leurs plannings, puis rassemblez équipes et entreprises.
              </p>
            </div>
          </div>
          <div className="admin-overview">
            {[
              {
                title: 'Formations & plannings',
                count: store.calendars.length,
                icon: 'calendar',
                view: 'calendars',
                text: 'Programmes, compétences visées et calendriers partagés.',
              },
              {
                title: 'Utilisateurs',
                count: users.length,
                icon: 'users',
                view: 'users',
                text: 'Conseillers, administrateurs et contacts entreprise.',
              },
              {
                title: 'Entreprises',
                count: companies.length,
                icon: 'brief',
                view: 'companies',
                text: 'Partenaires, contacts et coordonnées.',
              },
            ].map((item) => (
              <button
                key={item.view}
                className="panel admin-overview-card"
                onClick={() => {
                  setQuery('');
                  go(item.view);
                }}
              >
                <Icon name={item.icon} />
                <strong>{item.count}</strong>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                <span>
                  Ouvrir <Icon name="arrow" size={16} />
                </span>
              </button>
            ))}
          </div>
          <section className="panel admin-quick-actions">
            <h2>Ajouter à votre réseau</h2>
            <div className="exception-actions">
              <Button onClick={() => openModal({ kind: 'calendar' })}>
                <Icon name="plus" />
                Ajouter une formation
              </Button>
              <Button variant="secondary" onClick={() => start('users')}>
                Ajouter un utilisateur
              </Button>
              <Button variant="secondary" onClick={() => start('companies')}>
                Ajouter une entreprise
              </Button>
            </div>
            <p>
              Les changements sont enregistrés dans ce navigateur. La création de comptes et les
              invitations sont simulées.
            </p>
          </section>
        </>
      )}
      {adding && (
        <Modal
          title={adding === 'users' ? 'Ajouter un utilisateur' : 'Ajouter une entreprise'}
          onClose={() => setAdding(null)}
        >
          <form className="admin-create-form" onSubmit={submit}>
            <div className="form-grid">
              {adding === 'users' ? (
                <>
                  <label>
                    Prénom
                    <input name="firstName" required />
                  </label>
                  <label>
                    Nom
                    <input name="lastName" required />
                  </label>
                  <label>
                    Rôle
                    <Select value={userRole} onChange={(e) => setUserRole(e.target.value as Role)}>
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  </label>
                  {userRole === 'company' && (
                    <label>
                      Entreprise de rattachement
                      <Select name="companyId" required>
                        <option value="">Choisir une entreprise</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </Select>
                    </label>
                  )}
                </>
              ) : (
                <>
                  <label>
                    Nom de l’entreprise
                    <input name="name" required />
                  </label>
                  <label>
                    Secteur d’activité
                    <input name="sector" required />
                  </label>
                  <label>
                    Contact principal
                    <input name="contact" required />
                  </label>
                  <label>
                    Fonction du contact
                    <input name="position" required />
                  </label>
                  <label>
                    SIRET (facultatif)
                    <input name="siret" inputMode="numeric" pattern="[0-9]{14}" maxLength={14} />
                  </label>
                  <label>
                    Ville
                    <input name="location" required />
                  </label>
                </>
              )}
              <label>
                E-mail
                <input name="email" type="email" required />
              </label>
              <label>
                Téléphone
                <input name="phone" type="tel" required />
              </label>
              <label>
                Adresse complète
                <input name="address" required />
              </label>
              <label>
                Campus
                <Select name="school">
                  <option value="campus-a">Atelier Campus</option>
                  <option value="campus-b">Campus B</option>
                </Select>
              </label>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-footer">
              <Button variant="secondary" onClick={() => setAdding(null)}>
                Annuler
              </Button>
              <Button type="submit">
                {adding === 'users' ? 'Enregistrer l’utilisateur' : 'Enregistrer l’entreprise'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
