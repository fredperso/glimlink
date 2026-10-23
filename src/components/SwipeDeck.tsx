import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useApp } from '../context.tsx';
import { checkAvailability, type Calendar, type Need, type Student } from '../domain/model.ts';
import { profileReading } from '../domain/reading.ts';
import AdviserRelay from './AdviserRelay.tsx';
import { applySwipe, undoSwipe, type SwipeDecision } from '../domain/swipe.ts';
import { Avatar, Button, Icon, Week } from './ui.tsx';

type Direction = 'left' | 'right';
type Gesture = {
  id: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  lastX: number;
  lastT: number;
  vx: number;
  horizontal: boolean;
  fromTop: boolean;
  threshold: number;
  armed: boolean;
};
// Au-delà, le bureau présente une fiche « bento » et une file d’attente plutôt qu’un paquet.
const DESKTOP = '(min-width: 1024px)';
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rotation = (dx: number, width: number, fromTop: boolean) =>
  (dx / Math.max(width, 1)) * 14 * (fromTop ? 1 : -1);

export default function SwipeDeck({
  students,
  need,
  onGrid,
}: {
  students: Student[];
  need: Need;
  onGrid: () => void;
}) {
  const { store, setStore, go, openModal, notify } = useApp();
  const [history, setHistory] = useState<SwipeDecision[]>([]);
  const [message, setMessage] = useState('');
  const [match, setMatch] = useState<Student | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [returning, setReturning] = useState<{ id: string; direction: Direction } | null>(null);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(0);
  const [pulse, setPulse] = useState(0);
  const busyRef = useRef(false);
  const matchShown = useRef(false);
  const deckRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef(0);
  const pending = students.filter(
    (s) => !need.passed.includes(s.id) && !need.selected.includes(s.id),
  );
  const focused = pending.find((s) => s.id === focusId);
  const ordered = focused ? [focused, ...pending.filter((s) => s !== focused)] : pending;
  const card = ordered[0];
  const decided = students.length - pending.length;
  const selectedStudents = store.students.filter(
    (s) => s.published && need.selected.includes(s.id),
  );

  // La carte qui arrive au premier plan repart d’un état neutre (styles du geste, animations JS).
  useLayoutEffect(() => {
    for (const element of [topRef.current, nextRef.current]) {
      if (!element) continue;
      element.getAnimations().forEach((animation) => {
        if (!('animationName' in animation)) animation.cancel();
      });
      element.style.transform = '';
      element.style.removeProperty('--like');
      element.style.removeProperty('--nope');
    }
  }, [card?.id, ordered[1]?.id]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function paint() {
    frame.current = 0;
    const g = gesture.current;
    const element = topRef.current;
    if (!g || !element) return;
    const ratio = Math.min(1, Math.abs(g.dx) / g.threshold);
    element.style.transform = `translate3d(${g.dx}px, ${g.dy * 0.2}px, 0) rotate(${rotation(g.dx, element.offsetWidth, g.fromTop)}deg)`;
    element.style.setProperty('--like', String(g.dx > 0 ? ratio : 0));
    element.style.setProperty('--nope', String(g.dx < 0 ? ratio : 0));
    if (nextRef.current)
      nextRef.current.style.transform = `translateY(${(1 - ratio) * 14}px) scale(${0.94 + 0.06 * ratio})`;
  }

  function flingExit(element: HTMLElement, direction: Direction, from?: Gesture) {
    const sign = direction === 'right' ? 1 : -1;
    const dx = from?.dx ?? 0;
    const dy = (from?.dy ?? 0) * 0.2;
    const toX = sign * (window.innerWidth / 2 + element.offsetWidth * 1.2);
    const speed = Math.max(Math.abs(from?.vx ?? 0), 1.6);
    const duration = Math.min(420, Math.max(200, Math.abs(toX - dx) / speed));
    const easing = 'cubic-bezier(0.25, 0.6, 0.35, 1)';
    element.style.setProperty(direction === 'right' ? '--like' : '--nope', '1');
    nextRef.current?.animate(
      [
        { transform: nextRef.current.style.transform || 'translateY(14px) scale(0.94)' },
        { transform: 'none' },
      ],
      { duration, easing, fill: 'forwards' },
    );
    return element.animate(
      [
        {
          transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${rotation(dx, element.offsetWidth, from?.fromTop ?? true)}deg)`,
        },
        { transform: `translate3d(${toX}px, ${dy + 40}px, 0) rotate(${sign * 24}deg)` },
      ],
      { duration, easing, fill: 'forwards' },
    );
  }

  // Sur ordinateur, un profil retenu s’envole vers le plateau de sélection.
  function desktopExit(element: HTMLElement, direction: Direction) {
    const tray = trayRef.current;
    if (direction === 'right' && tray?.offsetParent) {
      const from = element.getBoundingClientRect();
      const to = tray.getBoundingClientRect();
      const x = to.left + to.width / 2 - (from.left + from.width / 2);
      const y = to.top + 40 - (from.top + from.height / 2);
      return element.animate(
        [
          { transform: 'none', opacity: 1 },
          { transform: `translate(${x}px, ${y}px) scale(0.08)`, opacity: 0.2 },
        ],
        { duration: 560, easing: 'cubic-bezier(0.55, 0, 0.25, 1)', fill: 'forwards' },
      );
    }
    const sign = direction === 'right' ? 1 : -1;
    return element.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: `translateX(${sign * 90}px) rotate(${sign * 6}deg)`, opacity: 0 },
      ],
      { duration: 260, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
    );
  }

  async function decide(direction: Direction, from?: Gesture) {
    if (!card || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const target = card;
    const element = topRef.current;
    if (element && !reducedMotion()) {
      const animation =
        window.matchMedia(DESKTOP).matches && !from
          ? desktopExit(element, direction)
          : flingExit(element, direction, from);
      await animation.finished.catch(() => undefined);
    }
    commit(target, direction);
  }

  function commit(target: Student, direction: Direction) {
    const decision: SwipeDecision = { needId: need.id, studentId: target.id, direction };
    const firstName = target.published!.firstName;
    setStore((prev) => applySwipe(prev, decision));
    setHistory((entries) => [...entries, decision]);
    setFocusId(null);
    setReturning(null);
    setMessage(
      direction === 'right'
        ? `${firstName} ajouté à votre sélection.`
        : `${firstName} passé. Vous pouvez annuler ce choix.`,
    );
    busyRef.current = false;
    setBusy(false);
    if (direction === 'right') {
      setPulse((value) => value + 1);
      // Le grand écran de « match » n’interrompt que la première sélection de la session.
      if (!matchShown.current) {
        matchShown.current = true;
        setMatch(target);
      } else if (!reducedMotion()) setBurst((value) => value + 1);
    }
  }

  function springBack() {
    const element = topRef.current;
    if (!element) return;
    element.style.removeProperty('--like');
    element.style.removeProperty('--nope');
    const easing = 'cubic-bezier(0.18, 1.35, 0.4, 1)';
    const next = nextRef.current;
    if (next) {
      const start = next.style.transform;
      next.style.transform = '';
      if (start && !reducedMotion())
        next.animate([{ transform: start }, { transform: 'translateY(14px) scale(0.94)' }], {
          duration: 380,
          easing,
        });
    }
    const start = element.style.transform;
    element.style.transform = '';
    if (start && !reducedMotion())
      element.animate([{ transform: start }, { transform: 'none' }], {
        duration: 420,
        easing,
      });
  }

  function undo() {
    const last = history.at(-1);
    if (!last || busyRef.current) return;
    setStore((prev) => undoSwipe(prev, last));
    setHistory((entries) => entries.slice(0, -1));
    setFocusId(last.studentId);
    setReturning({ id: last.studentId, direction: last.direction });
    setMessage('Dernier choix annulé. Le profil est de nouveau disponible.');
  }

  function openProfile() {
    if (card) openModal({ kind: 'profile', studentId: card.id, needId: need.id });
  }

  // Raccourcis clavier globaux tant que le paquet est visible et qu’aucun champ n’a le focus.
  const shortcuts = useRef({ decide, undo, openProfile });
  shortcuts.current = { decide, undo, openProfile };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (document.querySelector('dialog[open]')) return;
      const target = event.target as HTMLElement;
      if (
        target.closest(
          'input, textarea, select, [contenteditable="true"], [role="listbox"], [role="combobox"], [role="menu"]',
        )
      )
        return;
      const deck = deckRef.current?.getBoundingClientRect();
      if (!deck || deck.bottom < 0 || deck.top > window.innerHeight) return;
      const actions: Record<string, () => void> = {
        ArrowRight: () => shortcuts.current.decide('right'),
        ArrowLeft: () => shortcuts.current.decide('left'),
        ArrowUp: () => shortcuts.current.openProfile(),
        Backspace: () => shortcuts.current.undo(),
        z: () => shortcuts.current.undo(),
      };
      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function down(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      busyRef.current ||
      (event.target as HTMLElement).closest('button, a, input, select, textarea')
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    gesture.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dx: 0,
      dy: 0,
      lastX: event.clientX,
      lastT: event.timeStamp,
      vx: 0,
      horizontal: false,
      fromTop: event.clientY < rect.top + rect.height / 2,
      threshold: Math.max(70, Math.min(120, rect.width * 0.28)),
      armed: false,
    };
  }
  function move(event: ReactPointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    const dx = event.clientX - g.startX;
    const dy = event.clientY - g.startY;
    if (!g.horizontal) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        gesture.current = null;
        return;
      }
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      g.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      stageRef.current?.classList.add('is-dragging');
    }
    const elapsed = Math.max(1, event.timeStamp - g.lastT);
    g.vx = g.vx * 0.6 + ((event.clientX - g.lastX) / elapsed) * 0.4;
    g.lastX = event.clientX;
    g.lastT = event.timeStamp;
    g.dx = dx;
    g.dy = dy;
    // Retour haptique discret au franchissement du seuil (Android ; ignoré ailleurs).
    const armed = Math.abs(dx) >= g.threshold;
    if (armed && !g.armed) navigator.vibrate?.(8);
    g.armed = armed;
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  }
  function up(event: ReactPointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    gesture.current = null;
    stageRef.current?.classList.remove('is-dragging');
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (!g || g.id !== event.pointerId || !g.horizontal) return;
    const fling =
      Math.abs(g.vx) > 0.5 && Math.abs(g.dx) > 30 && Math.sign(g.vx) === Math.sign(g.dx);
    if (Math.abs(g.dx) >= g.threshold || fling) void decide(g.dx > 0 ? 'right' : 'left', g);
    else springBack();
  }
  function cancel() {
    const g = gesture.current;
    gesture.current = null;
    stageRef.current?.classList.remove('is-dragging');
    if (g?.horizontal) springBack();
  }

  return (
    <section className="profile-deck" ref={deckRef} aria-label="Explorer les candidats par cartes">
      <div className="deck-intro">
        <h2>Un profil, une possibilité.</h2>
        <p id="swipe-instructions">
          Glissez à droite pour sélectionner, à gauche pour passer : passer n’est pas refuser, le
          profil reste dans Tous les profils. Au clavier : flèche droite pour sélectionner, flèche
          gauche pour passer, flèche haut pour le profil et le CV, retour arrière pour annuler.
        </p>
      </div>
      <div className="deck-layout">
        <aside className="deck-rail" aria-label="File des profils">
          <div className="deck-rail-head">
            <h3>À découvrir</h3>
            <span>{pending.length}</span>
          </div>
          {ordered.length > 0 ? (
            <ol className="deck-queue">
              {ordered.slice(0, 6).map((student, index) => (
                <li key={student.id}>
                  <button
                    type="button"
                    className={index === 0 ? 'is-current' : ''}
                    aria-current={index === 0 ? 'true' : undefined}
                    onClick={() => setFocusId(student.id)}
                    disabled={busy}
                  >
                    <Avatar variant={student.avatar} small />
                    <span>
                      <strong>{student.published!.firstName}</strong>
                      <small>
                        {store.calendars
                          .find((c) => c.id === student.published!.trainingId)
                          ?.title.split(' · ')[0] ?? 'Formation à vérifier'}
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="micro">Tous les profils de cet onglet ont été explorés.</p>
          )}
          {ordered.length > 6 && <p className="micro">+ {ordered.length - 6} autres profils</p>}
          <div className="deck-tray" ref={trayRef}>
            <div key={pulse} className={`deck-tray-head ${pulse ? 'is-pulsing' : ''}`}>
              <Icon name="heart" size={18} />
              <h3>Ma sélection</h3>
              <span>{selectedStudents.length}</span>
            </div>
            {selectedStudents.length ? (
              <>
                <div className="deck-tray-avatars" aria-hidden="true">
                  {selectedStudents.slice(-6).map((student) => (
                    <Avatar key={student.id} variant={student.avatar} small />
                  ))}
                </div>
                <Button onClick={() => openModal({ kind: 'request', needId: need.id })}>
                  Demander une mise en relation
                </Button>
              </>
            ) : (
              <p className="micro">Les profils retenus s’empilent ici.</p>
            )}
          </div>
        </aside>
        <div className="deck-column">
          {students.length > 1 && (
            <div className="deck-progress" aria-hidden="true">
              {students.map((student, index) => (
                <span
                  key={student.id}
                  className={index < decided ? 'done' : index === decided ? 'current' : ''}
                />
              ))}
            </div>
          )}
          {card ? (
            <>
              <div className="deck-stage" ref={stageRef}>
                {ordered
                  .slice(0, 3)
                  .reverse()
                  .map((student, index, list) => {
                    const position = list.length - 1 - index;
                    const top = position === 0;
                    return (
                      <div
                        key={student.id}
                        ref={top ? topRef : position === 1 ? nextRef : undefined}
                        className={`deck-slot deck-slot-${position} ${top && returning?.id === student.id ? `returning-${returning.direction}` : ''}`}
                        aria-hidden={top ? undefined : true}
                        inert={!top}
                        tabIndex={top ? 0 : undefined}
                        role={top ? 'group' : undefined}
                        aria-label={top ? `Profil de ${student.published!.firstName}` : undefined}
                        aria-describedby={top ? 'swipe-instructions' : undefined}
                        onPointerDown={top ? down : undefined}
                        onPointerMove={top ? move : undefined}
                        onPointerUp={top ? up : undefined}
                        onPointerCancel={top ? cancel : undefined}
                      >
                        <DeckCard student={student} need={need} calendars={store.calendars} />
                      </div>
                    );
                  })}
                {burst > 0 && (
                  <span key={burst} className="deck-burst" aria-hidden="true">
                    <Icon name="heart" size={64} />
                  </span>
                )}
              </div>
              <div className="deck-actions">
                <button
                  type="button"
                  className="deck-action deck-undo"
                  onClick={undo}
                  disabled={!history.length || busy}
                  aria-label="Annuler le dernier choix"
                >
                  <span className="deck-action-circle">
                    <Icon name="undo" size={20} />
                  </span>
                  <span className="deck-action-label">Annuler</span>
                  <kbd aria-hidden="true">⌫</kbd>
                </button>
                <button
                  type="button"
                  className="deck-action deck-pass"
                  onClick={() => void decide('left')}
                  disabled={busy}
                >
                  <span className="deck-action-circle">
                    <Icon name="close" size={30} />
                  </span>
                  <span className="deck-action-label">Passer</span>
                  <kbd aria-hidden="true">←</kbd>
                </button>
                <button
                  type="button"
                  className="deck-action deck-select"
                  onClick={() => void decide('right')}
                  disabled={busy}
                >
                  <span className="deck-action-circle">
                    <Icon name="heart" size={32} />
                  </span>
                  <span className="deck-action-label">Sélectionner</span>
                  <kbd aria-hidden="true">→</kbd>
                </button>
                <button type="button" className="deck-action deck-info" onClick={openProfile}>
                  <span className="deck-action-circle">
                    <Icon name="info" size={20} />
                  </span>
                  <span className="deck-action-label">Profil & CV</span>
                  <kbd aria-hidden="true">↑</kbd>
                </button>
              </div>
            </>
          ) : (
            <div className="deck-finished">
              <Icon name="check" size={36} />
              <h3>Vous avez parcouru tous les profils.</h3>
              <p>
                Les profils passés restent disponibles : passer n’est pas refuser. Mathilde prend le
                relais dès que vous demandez une mise en relation.
              </p>
              {need.selected.length > 0 && (
                <Button onClick={() => go('selections', need.id)}>Voir ma sélection</Button>
              )}
              {need.passed.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStore((prev) => ({
                      ...prev,
                      needs: prev.needs.map((n) => (n.id === need.id ? { ...n, passed: [] } : n)),
                    }));
                    setHistory([]);
                    notify('Les profils passés reviennent dans Découvrir.');
                  }}
                >
                  Revoir les profils passés
                </Button>
              )}
              <Button variant="secondary" onClick={onGrid}>
                Voir tous les profils
              </Button>
              {history.length > 0 && (
                <button className="text-button" type="button" onClick={undo}>
                  <Icon name="undo" size={16} /> Annuler le dernier choix
                </button>
              )}
            </div>
          )}
          {!card && need.selected.length === 0 && <AdviserRelay need={need} />}
          {match && (
            <MatchDialog
              student={match}
              onClose={() => setMatch(null)}
              onRequest={() => {
                setMatch(null);
                openModal({ kind: 'request', needId: need.id });
              }}
            />
          )}
          <p className="deck-feedback" role="status" aria-live="polite">
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}

// Carte de profil V6 : identité sans photo, lecture personnalisée, aucun score affiché.
// Sur téléphone, le contenu défile dans la carte ; sur ordinateur, il forme des tuiles.
function DeckCard({
  student,
  need,
  calendars,
}: {
  student: Student;
  need: Need;
  calendars: Calendar[];
}) {
  const data = student.published!;
  const calendar = calendars.find((c) => c.id === data.trainingId);
  const checks = checkAvailability(data, calendar, need);
  const reading = profileReading(student, need, calendars);
  const training = calendar?.title.split(' · ')[0] ?? 'Formation à vérifier';
  return (
    <article className="deck-card">
      <div className={`deck-hero talent-art-${student.avatar % 6}`}>
        <Avatar variant={student.avatar} />
        {reading.declic && <span className="art-label">Déclic Glimlink</span>}
        <span className="deck-stamp stamp-like" aria-hidden="true">
          Je retiens
        </span>
        <span className="deck-stamp stamp-nope" aria-hidden="true">
          Je passe
        </span>
        <div className="deck-identity">
          <h3>{data.firstName}</h3>
          <p className="deck-meta">
            <span>{training}</span>
            <span>
              <Icon name="pin" size={14} />
              {data.location}
            </span>
          </p>
        </div>
      </div>
      <div className="deck-body">
        <section className="deck-tile deck-tile-why">
          <h4>
            <Icon name="spark" size={16} /> Pourquoi ce profil pour votre besoin ?
          </h4>
          <p>{reading.why}</p>
          <ul className="fact-chips" aria-label="Ce qui ressort">
            {reading.highlights.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </section>
        {reading.declic && (
          <section className="deck-tile deck-tile-declic">
            <h4>
              <Icon name="spark" size={16} /> Déclic Glimlink
            </h4>
            <p>{reading.declic}</p>
          </section>
        )}
        <section className="deck-tile deck-tile-missions">
          <h4>
            <Icon name="brief" size={16} /> En lien avec vos missions
          </h4>
          <ul className="mission-links">
            {reading.missions.map((item) => (
              <li key={item.mission} className={`link-${item.status}`}>
                <Icon name={item.status === 'unknown' ? 'help' : 'check'} size={15} />
                <span>
                  <strong>{item.mission}</strong>
                  <small>{item.label}</small>
                </span>
              </li>
            ))}
          </ul>
          {checks.length > 0 && (
            <ul className="deck-checks">
              {checks.map((check) => (
                <li key={check.text} className={`check-${check.kind}`}>
                  <Icon name={check.kind === 'ok' ? 'check' : 'alert'} size={15} />
                  {check.text}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="deck-tile deck-tile-rhythm">
          <h4>
            <Icon name="calendar" size={16} /> Son rythme de formation
          </h4>
          <Week
            calendar={calendar}
            required={need.requiredDays}
            unavailable={data.unavailableDays}
          />
          {!need.requiredDays.length && (
            <p className="micro">Consultable même s’il n’a pas servi à la recherche.</p>
          )}
        </section>
      </div>
    </article>
  );
}

// Moment « match » plein écran : la sélection est confirmée, la mise en relation reste un choix.
function MatchDialog({
  student,
  onClose,
  onRequest,
}: {
  student: Student;
  onClose: () => void;
  onRequest: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const continueButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    continueButton.current?.focus();
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
      className="deck-match"
      aria-labelledby="deck-match-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="deck-match-avatars" aria-hidden="true">
        <Avatar variant={student.avatar} />
        <span className="deck-match-heart">
          <Icon name="heart" size={26} />
        </span>
      </div>
      <h2 id="deck-match-title">{student.published!.firstName} rejoint votre sélection</h2>
      <p>
        Rien n’est encore envoyé. Mathilde vérifie les disponibilités et prépare la rencontre quand
        vous demandez une mise en relation.
      </p>
      <Button onClick={onRequest}>
        Demander une mise en relation <Icon name="arrow" size={18} />
      </Button>
      <button
        ref={continueButton}
        type="button"
        className="text-button deck-match-continue"
        onClick={onClose}
      >
        Continuer à explorer
      </button>
    </dialog>
  );
}
