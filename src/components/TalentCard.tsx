import { SkillList } from './Skills.tsx';
import { useApp } from '../context.tsx';
import { checkAvailability, scoreFor, type Student, type Need } from '../domain/model.ts';
import { Avatar, Icon } from './ui.tsx';

export function TalentCard({
  student,
  need,
  compact = false,
  deck = false,
}: {
  student: Student;
  need: Need;
  compact?: boolean;
  deck?: boolean;
}) {
  const { store, setStore, openModal, notify } = useApp();
  const data = student.published!;
  const selected = need.selected.includes(student.id);
  const calendar = store.calendars.find((c) => c.id === data.trainingId);
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
    <article className={`talent-card ${compact ? 'talent-card-compact' : ''}`}>
      <div className="talent-art">
        <Avatar variant={student.avatar} />
        <span className="score">
          <Icon name="spark" size={14} />
          {scoreFor(student, need)}
          <small>%</small>
        </span>
        {student.discoveryReason && <span className="art-label">Un autre regard</span>}
      </div>
      <div className="talent-content">
        <div className="talent-name-row">
          <h3>{data.firstName}</h3>
          <span>
            <Icon name="pin" size={14} />
            {data.location}
          </span>
        </div>
        <p className="training-name">{calendar?.title.split(' · ')[0] ?? 'Formation à vérifier'}</p>
        <SkillList skills={data.skills} calendars={store.calendars} compact />
        {student.discoveryReason ? (
          <p className="discovery-reason">
            <Icon name="spark" size={16} />
            {student.discoveryReason}
          </p>
        ) : (
          <p className={`calendar-check check-${check?.kind}`}>
            <Icon name={check?.kind === 'ok' ? 'check' : 'alert'} size={15} />
            {check?.text}
          </p>
        )}
        <div className="talent-actions">
          <button
            className="text-button"
            onClick={() => openModal({ kind: 'profile', studentId: student.id, needId: need.id })}
          >
            Voir le profil <Icon name="arrow" size={16} />
          </button>
          {!deck && (
            <button
              className={`select-button ${selected ? 'selected' : ''}`}
              onClick={toggle}
              aria-label={`${selected ? 'Retirer' : 'Sélectionner'} ${data.firstName}`}
              aria-pressed={selected}
            >
              <Icon name={selected ? 'check' : 'plus'} size={18} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
