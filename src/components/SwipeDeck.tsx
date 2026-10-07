import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useApp } from '../context.tsx';
import { type Student, type Need } from '../domain/model.ts';
import { applySwipe, undoSwipe, type SwipeDecision } from '../domain/swipe.ts';
import { TalentCard } from './TalentCard.tsx';
import { Button, Icon, Week } from './ui.tsx';

export default function SwipeDeck({
  students,
  need,
  onGrid,
}: {
  students: Student[];
  need: Need;
  onGrid: () => void;
}) {
  const { store, setStore, go } = useApp();
  const [drag, setDrag] = useState(0);
  const [exit, setExit] = useState<'left' | 'right' | null>(null);
  const [history, setHistory] = useState<SwipeDecision[]>([]);
  const [message, setMessage] = useState('');
  const gesture = useRef<{ x: number; y: number; id: number; horizontal: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const pending = students.filter(
    (s) => !need.passed.includes(s.id) && !need.selected.includes(s.id),
  );
  const card = pending[0];
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function decide(direction: 'left' | 'right') {
    if (!card || busy.current) return;
    busy.current = true;
    gesture.current = null;
    setExit(direction);
    const decision: SwipeDecision = { needId: need.id, studentId: card.id, direction };
    const firstName = card.published!.firstName;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(
      () => {
        setStore((prev) => applySwipe(prev, decision));
        setHistory((entries) => [...entries, decision]);
        setMessage(
          direction === 'right'
            ? `${firstName} ajouté à votre sélection.`
            : `${firstName} passé. Vous pouvez annuler ce choix.`,
        );
        setDrag(0);
        setExit(null);
        busy.current = false;
      },
      reduced ? 0 : 220,
    );
  }
  function undo() {
    const last = history.at(-1);
    if (!last || busy.current) return;
    setStore((prev) => undoSwipe(prev, last));
    setHistory((entries) => entries.slice(0, -1));
    setMessage('Dernier choix annulé. Le profil est de nouveau disponible.');
  }
  function down(event: PointerEvent<HTMLDivElement>) {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      busy.current ||
      (event.target as HTMLElement).closest('button, a, input, select, textarea')
    )
      return;
    gesture.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
      horizontal: false,
    };
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x,
      y = event.clientY - start.y;
    if (!start.horizontal && Math.abs(y) > 12 && Math.abs(y) > Math.abs(x)) {
      gesture.current = null;
      return;
    }
    if (!start.horizontal && Math.abs(x) > 10 && Math.abs(x) > Math.abs(y)) {
      start.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (start.horizontal) setDrag(Math.max(-250, Math.min(250, x)));
  }
  function up(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId || !start.horizontal) {
      setDrag(0);
      return;
    }
    const distance = event.clientX - start.x;
    const threshold = Math.max(60, Math.min(95, event.currentTarget.clientWidth * 0.22));
    if (Math.abs(distance) >= threshold) decide(distance > 0 ? 'right' : 'left');
    else setDrag(0);
  }
  return (
    <section className="profile-deck" aria-label="Explorer les candidats par cartes">
      <div className="deck-intro">
        <div>
          <h2>Un profil, une possibilité.</h2>
          <p id="swipe-instructions">Glissez à droite pour sélectionner, à gauche pour passer.</p>
        </div>
        <span className="deck-remaining">{pending.length} à explorer</span>
      </div>
      <div className="deck-layout">
        <div className="deck-column">
          {card ? (
            <>
              <div className="deck-stage">
                {pending.length > 1 && (
                  <div className="deck-back deck-back-one" aria-hidden="true" />
                )}
                {pending.length > 2 && (
                  <div className="deck-back deck-back-two" aria-hidden="true" />
                )}
                <div
                  className={`deck-front ${drag ? 'is-dragging' : ''} ${exit ? `exit-${exit}` : ''}`}
                  tabIndex={0}
                  role="group"
                  aria-label={`Profil de ${card.published!.firstName}`}
                  aria-describedby="swipe-instructions"
                  onPointerDown={down}
                  onPointerMove={move}
                  onPointerUp={up}
                  onPointerCancel={() => {
                    gesture.current = null;
                    setDrag(0);
                  }}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                      event.preventDefault();
                      decide(event.key === 'ArrowRight' ? 'right' : 'left');
                    }
                  }}
                  style={
                    exit
                      ? undefined
                      : { transform: `translateX(${drag}px) rotate(${drag / 22}deg)` }
                  }
                >
                  <div
                    className={`deck-stamp ${drag > 20 || exit === 'right' ? 'stamp-select' : drag < -20 || exit === 'left' ? 'stamp-pass' : ''}`}
                    aria-hidden="true"
                  >
                    {drag > 0 || exit === 'right' ? 'Sélectionner' : 'Passer'}
                  </div>
                  <TalentCard student={card} need={need} deck />
                </div>
              </div>
              <div className="deck-actions">
                <button
                  type="button"
                  className="deck-action deck-pass"
                  onClick={() => decide('left')}
                  disabled={!!exit}
                >
                  <Icon name="close" size={24} />
                  <span>Passer</span>
                </button>
                <button
                  type="button"
                  className="deck-action deck-select"
                  onClick={() => decide('right')}
                  disabled={!!exit}
                >
                  <Icon name="heart" size={24} />
                  <span>Sélectionner</span>
                </button>
              </div>
              <p className="deck-keyboard">
                Vous pouvez aussi utiliser les boutons ou les flèches du clavier.
              </p>
            </>
          ) : (
            <div className="deck-finished">
              <Icon name="check" size={36} />
              <h3>Vous avez exploré ces profils.</h3>
              <p>
                Retrouvez les candidats retenus dans votre sélection. Mathilde prend le relais pour
                la mise en relation.
              </p>
              <Button onClick={() => go('selections', need.id)}>Voir ma sélection</Button>
              <Button variant="secondary" onClick={onGrid}>
                Revoir les profils en grille
              </Button>
            </div>
          )}
          <div className="deck-footer">
            <button
              className="text-button"
              type="button"
              onClick={undo}
              disabled={!history.length || !!exit}
            >
              <Icon name="undo" size={16} /> Annuler le dernier choix
            </button>
            <span>
              {need.selected.length} sélectionné{need.selected.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="deck-feedback" role="status" aria-live="polite">
            {message}
          </p>
        </div>
        <aside className="deck-details">
          <h3>Des compétences. Un rythme. Un projet.</h3>
          <p>
            Explorez les parcours validés par le centre. Consultez la fiche complète avant de
            préparer une rencontre.
          </p>
          {card && (
            <>
              <h4>Son rythme de formation</h4>
              <Week
                calendar={store.calendars.find((c) => c.id === card.published!.trainingId)}
                required={need.requiredDays}
                unavailable={card.published!.unavailableDays}
              />
              <p>
                <strong>Mobilité :</strong> {card.published!.mobility || 'À vérifier avec Mathilde'}
              </p>
            </>
          )}
          <div className="deck-human">
            <Icon name="message" />
            <p>
              Sélectionner un profil prépare un échange avec Mathilde. Passer un profil reste
              réversible.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
