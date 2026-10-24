import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export type SheetTab<T extends string> = {
  id: T;
  label: string;
  // Résumé d’une ligne : l’état de la rubrique se lit sans l’ouvrir.
  hint?: string;
  tone?: 'ok' | 'todo';
  changed?: boolean;
};

// Onglets d’une fiche en popin : verticaux sur grand écran, pastilles défilantes sur mobile.
// Flèches, Début et Fin déplacent la sélection (motif ARIA « tabs » à activation automatique).
export function SheetTabs<T extends string>({
  id,
  label,
  tabs,
  active,
  onChange,
  vertical = false,
}: {
  id: string;
  label: string;
  tabs: SheetTab<T>[];
  active: T;
  onChange: (tab: T) => void;
  vertical?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (event: KeyboardEvent) => {
    const index = tabs.findIndex((tab) => tab.id === active);
    const step: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    let next = index;
    if (event.key in step) next = (index + step[event.key] + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    onChange(tabs[next].id);
    ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };
  return (
    <div
      ref={ref}
      className={`sheet-tabs ${vertical ? 'sheet-tabs-vertical' : ''}`}
      role="tablist"
      aria-label={label}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      onKeyDown={move}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`${id}-tab-${tab.id}`}
          aria-selected={active === tab.id}
          aria-controls={`${id}-panel-${tab.id}`}
          tabIndex={active === tab.id ? 0 : -1}
          className={active === tab.id ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          {tab.tone && <span className={`sheet-dot sheet-dot-${tab.tone}`} aria-hidden="true" />}
          <span className="sheet-tab-text">
            <span>{tab.label}</span>
            {tab.hint && <small>{tab.hint}</small>}
          </span>
          {tab.changed && <span className="sheet-changed">Modifié</span>}
        </button>
      ))}
    </div>
  );
}

export function SheetPanel<T extends string>({
  id,
  tab,
  active,
  children,
}: {
  id: string;
  tab: T;
  active: T;
  children: ReactNode;
}) {
  // Les rubriques inactives restent montées : saisies et éditeurs gardent leur état.
  return (
    <div
      role="tabpanel"
      id={`${id}-panel-${tab}`}
      aria-labelledby={`${id}-tab-${tab}`}
      hidden={active !== tab}
      className="sheet-section"
    >
      {children}
    </div>
  );
}
