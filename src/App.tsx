import { notifications } from './domain/notifications.ts';
import { useEffect, useRef, useState } from 'react';
import { AppContext, type ModalState } from './context.tsx';
import { loadStore, persistStore } from './domain/storage.ts';
import {
  adviserRequests,
  adviserStore,
  getCompanies,
  getCompany,
  companyStore,
  type Role,
} from './domain/model.ts';
import { Badge, Icon, Logo } from './components/ui.tsx';
import Company from './components/Company.tsx';
import Adviser from './components/Adviser.tsx';
import Modals from './components/Modals.tsx';
import NeedBuilder from './components/NeedBuilder.tsx';

function route() {
  const [path, query] = location.hash.slice(1).split('?');
  const [, role, view] = (path || '/company/home').split('/');
  const params = new URLSearchParams(query);
  return {
    role: (role === 'adviser' ? 'adviser' : 'company') as Role,
    view: view || 'home',
    needId: params.get('need') || 'need-admin',
  };
}
export default function App() {
  const [store, setStore] = useState(loadStore);
  const [current, setCurrent] = useState(route);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState('');
  const [mobileMore, setMobileMore] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const initialRoute = useRef(true);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!persistStore(store)) setStorageFailed(true);
  }, [store]);
  useEffect(() => {
    const handler = () => {
      setCurrent(route());
      setModal(null);
      setMobileMore(false);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  useEffect(() => {
    if (initialRoute.current) {
      initialRoute.current = false;
      return;
    }
    mainRef.current?.focus();
    window.scrollTo(0, 0);
  }, [current]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 5500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const go = (view: string, needId?: string, role: Role = current.role) => {
    location.hash = `/${role}/${view}${needId ? `?need=${encodeURIComponent(needId)}` : ''}`;
  };
  const notify = (message: string) => setToast(message);
  const companyView = companyStore(store);
  const unread = companyView.alerts.filter((a) => !a.read).length;
  const selections = companyView.needs.reduce(
    (n, need) => n + (need.status === 'active' ? need.selected.length : 0),
    0,
  );
  const notificationCount = notifications(store, current.role).filter((item) => !item.read).length;
  const pending = adviserRequests(store).filter((r) => r.status === 'received').length;
  const companyNav = [
    ['home', 'home', 'Vue d’ensemble', 0],
    [
      'needs',
      'brief',
      'Mes besoins',
      companyView.needs.filter((n) => n.status === 'active').length,
    ],
    ['selections', 'heart', 'Mes sélections', selections],
    ['requests', 'users', 'Mises en relation', companyView.requests.length],
    ['alerts', 'bell', 'Talent Alerts', unread],
  ] as const;
  const adviserNav = [
    ['home', 'home', 'Vue d’ensemble', 0],
    ['students', 'users', 'Vivier de talents', 0],
    ['calendars', 'calendar', 'Formations & rythmes', 0],
    ['needs', 'brief', 'Besoins entreprises', 0],
    ['requests', 'message', 'Demandes à traiter', pending],
    ['companies', 'brief', 'Entreprises partenaires', 0],
  ] as const;
  const nav = current.role === 'company' ? companyNav : adviserNav;
  const mobileNav = current.role === 'adviser' ? nav.slice(0, 4) : nav;
  const activeView = ['discover', 'new-need'].includes(current.view) ? 'needs' : current.view;
  return (
    <AppContext
      value={{
        store: current.role === 'company' ? companyView : adviserStore(store),
        setStore,
        ...current,
        go,
        openModal: setModal,
        closeModal: () => setModal(null),
        notify,
      }}
    >
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
          mainRef.current?.scrollIntoView();
        }}
      >
        Aller au contenu
      </a>
      <aside className="sidebar">
        <a className="brand-link" href={`#/${current.role}/home`} aria-label="Glimlink, accueil">
          <Logo />
        </a>
        <div className="workspace">
          <span className="workspace-icon">
            <Icon name={current.role === 'company' ? 'brief' : 'users'} />
          </span>
          <div>
            <strong>
              {current.role === 'company'
                ? getCompany(store, store.activeCompanyId).name
                : 'Atelier Campus'}
            </strong>
            <small>
              {current.role === 'company' ? 'Entreprise partenaire' : 'Équipe formation'}
            </small>
          </div>
          <span className="workspace-dot" />
        </div>
        <nav aria-label="Navigation principale">
          {nav.map(([id, icon, text, count]) => (
            <a
              key={id}
              href={`#/${current.role}/${id}`}
              className={`nav-link ${activeView === id ? 'active' : ''}`}
              aria-current={activeView === id ? 'page' : undefined}
            >
              <Icon name={icon} />
              <span>{text}</span>
              {count > 0 && <span className="nav-count">{count}</span>}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="tiny-constellation" aria-hidden="true">
              ✧
            </span>
            {current.role === 'company' ? (
              <>
                <strong>
                  Un recrutement,
                  <br />
                  une rencontre.
                </strong>
                <p>Votre conseiller est à vos côtés à chaque étape.</p>
                <button onClick={() => setModal({ kind: 'contact' })}>
                  Contacter le conseiller <Icon name="arrow" size={16} />
                </button>
              </>
            ) : (
              <>
                <strong>
                  Vous faites
                  <br />
                  le lien.
                </strong>
                <p>Vérifiez les fiches avant de faire découvrir les talents aux entreprises.</p>
                <a href="#/adviser/students?status=pending">
                  Vérifier les brouillons <Icon name="arrow" size={16} />
                </a>
              </>
            )}
          </div>
          <button className="nav-link help-link" onClick={() => setModal({ kind: 'help' })}>
            <Icon name="help" />
            <span>Guide de la maquette</span>
            <Badge>V1</Badge>
          </button>
        </div>
        <div className="sidebar-account">
          <span className="initial-avatar">
            {current.role === 'company'
              ? getCompany(store, store.activeCompanyId)
                  .contact.split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')
              : 'MJ'}
          </span>
          <div>
            <strong>
              {current.role === 'company'
                ? getCompany(store, store.activeCompanyId).contact
                : 'Mathilde JEANNE'}
            </strong>
            <small>
              {current.role === 'company'
                ? getCompany(store, store.activeCompanyId).name
                : 'Conseillère formation'}
            </small>
          </div>
        </div>
      </aside>
      <div className="app-frame">
        <header className="topbar">
          <div className="mobile-logo">
            <Logo />
          </div>
          <div className="breadcrumb">
            {current.role === 'company' ? 'Espace entreprise' : 'Espace conseiller'}
            <span>/</span>
            <strong>{nav.find(([id]) => id === activeView)?.[2] ?? 'Vue d’ensemble'}</strong>
          </div>
          <div className="topbar-actions">
            <span className="prototype-label">Maquette interactive</span>
            <label className="role-select">
              <Icon name="grid" size={16} />
              <span className="sr-only">Choisir l’espace de démonstration</span>
              <select
                value={current.role}
                onChange={(e) => go('home', undefined, e.target.value as Role)}
              >
                <option value="company">Entreprise</option>
                <option value="adviser">Conseiller</option>
              </select>
            </label>
            <button
              type="button"
              className="icon-button notification-button"
              aria-label={`Notifications, ${notificationCount} non lue${notificationCount > 1 ? 's' : ''}`}
              aria-haspopup="dialog"
              onClick={() => setModal({ kind: 'notifications' })}
            >
              <Icon name="bell" />
              {notificationCount > 0 && (
                <span className="notification-count" aria-hidden="true">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>
            <span className="initial-avatar header-avatar">
              {current.role === 'company'
                ? getCompany(store, store.activeCompanyId)
                    .contact.split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                : 'MJ'}
            </span>
          </div>
        </header>
        <main id="main" className="main" tabIndex={-1} ref={mainRef}>
          {current.role === 'company' && current.view !== 'discover' && (
            <label className="demo-company-picker">
              Entreprise de démonstration
              <select
                aria-label="Entreprise de démonstration"
                value={store.activeCompanyId ?? 'maison-alba'}
                onChange={(e) => {
                  setStore((prev) => ({ ...prev, activeCompanyId: e.target.value }));
                  go('home', undefined, 'company');
                  setModal(null);
                }}
              >
                {getCompanies(store)
                  .filter((company) => !company.status || company.status === 'active')
                  .map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
              </select>
            </label>
          )}

          {storageFailed && (
            <p className="notice notice-warning">
              Le stockage local est indisponible. Les changements sont conservés pendant cette
              session uniquement.
            </p>
          )}
          {current.view === 'new-need' && current.role === 'company' ? (
            <NeedBuilder />
          ) : current.role === 'company' ? (
            <Company />
          ) : (
            <Adviser />
          )}
          <footer className="page-footer">
            <span>
              <Icon name="shield" size={14} /> Un vivier encadré. Des rencontres accompagnées.
            </span>
            <button onClick={() => setModal({ kind: 'help' })}>
              Données fictives · Maquette V1
            </button>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Navigation mobile">
        {mobileNav.map(([id, icon, label, count]) => (
          <a
            key={id}
            href={`#/${current.role}/${id}`}
            className={activeView === id ? 'active' : ''}
            aria-current={activeView === id ? 'page' : undefined}
          >
            <span>
              <Icon name={icon} />
              {count > 0 && <i>{count}</i>}
            </span>
            <small>
              {id === 'home'
                ? 'Accueil'
                : id === 'requests'
                  ? 'Demandes'
                  : id === 'students'
                    ? 'Talents'
                    : id === 'calendars'
                      ? 'Rythmes'
                      : id === 'selections'
                        ? 'Sélection'
                        : id === 'companies'
                          ? 'Partenaires'
                          : id === 'alerts'
                            ? 'Alertes'
                            : 'Besoins'}
            </small>
            <span className="sr-only">{label}</span>
          </a>
        ))}
        {current.role === 'adviser' && (
          <>
            <button
              type="button"
              className={`mobile-more-button ${['requests', 'companies'].includes(activeView) ? 'active' : ''}`}
              aria-expanded={mobileMore}
              aria-controls="mobile-more-links"
              onClick={() => setMobileMore((open) => !open)}
            >
              <Icon name="grid" />
              <small>Plus</small>
              <span className="sr-only">Demandes et entreprises partenaires</span>
            </button>
            {mobileMore && (
              <div id="mobile-more-links" className="mobile-more-panel">
                <a href="#/adviser/requests">
                  <Icon name="message" />
                  Demandes à traiter {pending > 0 && <Badge>{pending}</Badge>}
                </a>
                <a href="#/adviser/companies">
                  <Icon name="brief" />
                  Entreprises partenaires
                </a>
              </div>
            )}
          </>
        )}
      </nav>
      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <Icon name="check" />
            {toast}
            <button onClick={() => setToast('')} aria-label="Fermer la confirmation">
              <Icon name="close" size={16} />
            </button>
          </>
        )}
      </div>
      {modal && <Modals modal={modal} />}
    </AppContext>
  );
}
