import { useEffect, useRef, type ReactNode } from 'react';
import { DAYS, type Calendar, type Day } from '../domain/model.ts';

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10H3Z" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />
        <path d="m20 2 .7 1.3L22 4l-1.3.7L20 6l-.7-1.3L18 4l1.3-.7Z" />
      </>
    ),
    brief: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="3" />
        <path d="M8 7V4h8v3M3 12h18M10 12v3h4v-3" />
      </>
    ),
    heart: <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 2 10 8 15 6-5 12-11 8-15Z" />,
    users: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v3" />
      </>
    ),
    bell: (
      <>
        <path d="M5 16h14l-2-3V8a5 5 0 0 0-10 0v5ZM10 20h4" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4m10-4v4M3 10h18m-14 4h2m3 0h2m3 0h1m-11 4h2m3 0h2" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01" />
      </>
    ),
    file: (
      <>
        <path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h6" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    message: <path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" />,
    edit: (
      <>
        <path d="m15 4 5 5M4 20l5-1L21 7l-4-4L5 15ZM4 20h16" />
      </>
    ),
    logout: (
      <>
        <path d="M10 3H4v18h6m4-14 5 5-5 5m-6-5h11" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    phone: <path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4c-10 4-20-6-16-16Z" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    stack: (
      <>
        <rect x="6" y="3" width="15" height="15" rx="2" />
        <path d="M3 7v14h14" />
      </>
    ),
    alert: (
      <>
        <path d="m12 3 10 18H2Z" />
        <path d="M12 9v5m0 3h.01" />
      </>
    ),
    reset: (
      <>
        <path d="M4 10a8 8 0 1 1 2 8M4 3v7h7" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="currentColor" />
        <path
          d="M11 24V16a6 6 0 0 1 12 0v8a6 6 0 0 1-12 0m6 0v-8a6 6 0 0 1 12 0v8a6 6 0 0 1-12 0"
          stroke="#e7f19b"
          strokeWidth="3"
        />
      </svg>
      <span translate="no">
        glimlink<span className="logo-dot">.</span>
      </span>
    </span>
  );
}

export function Avatar({ variant = 0, small = false }: { variant?: number; small?: boolean }) {
  return (
    <div
      className={`avatar avatar-${variant % 6} ${small ? 'avatar-small' : ''}`}
      aria-hidden="true"
    >
      <div className="avatar-shape" />
      <span className="avatar-dot" />
      <span className="avatar-line" />
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}) {
  return (
    <button
      type={type}
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon name="spark" size={28} />
      </span>
      <h2>{title}</h2>
      <div className="empty-description">{children}</div>
      {action}
    </div>
  );
}

export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    document.body.classList.add('modal-open');
    return () => {
      dialog.close();
      document.body.classList.remove('modal-open');
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? 'modal-wide' : ''}`}
      aria-labelledby="modal-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <header className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Fermer la fenêtre">
          <Icon name="close" />
        </button>
      </header>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}

export function Week({
  calendar,
  required = [],
  unavailable = [],
}: {
  calendar?: Calendar;
  required?: Day[];
  unavailable?: Day[];
}) {
  const known = calendar?.mode === 'weekly';
  return (
    <>
      <div className="week" aria-label="Rythme hebdomadaire">
        {DAYS.map((day) => {
          const course = known && calendar.courseDays.includes(day);
          const off = unavailable.includes(day);
          return (
            <div
              key={day}
              className={`week-day ${course ? 'course' : off ? 'off' : known ? 'potential' : 'unknown'} ${required.includes(day) ? 'required' : ''}`}
            >
              <span>{day.slice(0, 3)}.</span>
              <strong>
                {course ? 'En cours' : off ? 'Indispo.' : known ? 'Dispo.*' : 'À vérifier'}
              </strong>
              {required.includes(day) && <span className="required-label">Demandé</span>}
            </div>
          );
        })}
      </div>
      <p className="micro">
        {known
          ? `* Jours sans cours : présence potentielle, à confirmer avec le conseiller.${calendar?.exceptions?.length ? ' Ce rythme de référence comporte des exceptions datées.' : ''}`
          : 'Le rythme ne permet pas de confirmer automatiquement la présence.'}
      </p>
    </>
  );
}

export function dateLabel(value: string): string {
  return value
    ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(value),
      )
    : 'À renseigner';
}
