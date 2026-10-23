import { useApp } from '../context.tsx';
import { checkAvailability, type Student, type Need } from '../domain/model.ts';
import { profileReading } from '../domain/reading.ts';
import { Avatar, Icon } from './ui.tsx';

// Carte de la vue « Tous les profils » : même vivier que le swipe, aucun score affiché (V6 §7-9).
export function TalentCard({ student, need }: { student: Student; need: Need }) {
  const { store, setStore, openModal, notify } = useApp();
  const data = student.published!;
  const selected = need.selected.includes(student.id);
  const passed = need.passed.includes(student.id);
  const calendar = store.calendars.find((c) => c.id === data.trainingId);
  const reading = profileReading(student, need, store.calendars);
  const linked = reading.missions.filter((item) => item.status !== 'unknown').length;
  const checks = checkAvailability(data, calendar, need);
  const check =
    checks.find((c) => c.kind === 'conflict') ??
    checks.find((c) => c.kind === 'unknown') ??
    checks[0];
  const toggle = () => {
    setStore((prev) => ({
      ...prev,
      needs: prev.needs.map((n) =>
        n.id === need.id
          ? {
              ...n,
              selected: selected
                ? n.selected.filter((id) => id !== student.id)
                : [...n.selected, student.id],
              passed: n.passed.filter((id) => id !== student.id),
            }
          : n,
      ),
    }));
    notify(
      selected
        ? `${data.firstName} retiré de votre sélection`
        : `${data.firstName} ajouté à votre sélection`,
    );
  };
  return (
    <article className={`talent-card ${passed ? 'is-passed' : ''}`}>
      <div className={`talent-art talent-art-${student.avatar % 6}`}>
        <Avatar variant={student.avatar} />
        {(selected || passed) && (
          <span className={`card-state ${selected ? 'state-selected' : 'state-passed'}`}>
            {selected ? 'Dans ma sélection' : 'Passé'}
          </span>
        )}
        {reading.declic && <span className="art-label">Déclic Glimlink</span>}
        <div className="talent-identity">
          <div className="talent-name-row">
            <h3>{data.firstName}</h3>
            <span>
              <Icon name="pin" size={14} />
              {data.location}
            </span>
          </div>
          <p className="training-name">
            {calendar?.title.split(' · ')[0] ?? 'Formation à vérifier'}
          </p>
        </div>
      </div>
      <div className="talent-content">
        <ul className="fact-chips" aria-label="Ce qui ressort">
          {reading.highlights.slice(0, 3).map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        {reading.declic ? (
          <p className="discovery-reason">
            <Icon name="spark" size={16} />
            {reading.declic}
          </p>
        ) : (
          <p className="mission-summary">
            {linked} mission{linked > 1 ? 's' : ''} sur {reading.missions.length} en lien avec son
            parcours
          </p>
        )}
        {check && (
          <p className={`calendar-check check-${check.kind}`}>
            <Icon name={check.kind === 'ok' ? 'check' : 'alert'} size={15} />
            {check.text}
          </p>
        )}
        <div className="talent-actions">
          <button
            className="text-button"
            onClick={() => openModal({ kind: 'profile', studentId: student.id, needId: need.id })}
          >
            Voir le profil <Icon name="arrow" size={16} />
          </button>
          <button
            className={`select-button ${selected ? 'selected' : ''}`}
            onClick={toggle}
            aria-label={`${selected ? 'Retirer' : 'Sélectionner'} ${data.firstName}`}
            aria-pressed={selected}
          >
            <Icon name={selected ? 'check' : 'heart'} size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
