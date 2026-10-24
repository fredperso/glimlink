import { activatePartner } from '../domain/company-experience.ts';
import Select from './Select.tsx';
import Notifications from './Notifications.tsx';
import {
  ChoiceSelect,
  CANDIDATE_MOBILITY,
  LOCATION_CHOICES,
  SECTOR_CHOICES,
  POSITION_CHOICES,
} from './Choices.tsx';
import SkillsEditor, { SkillList } from './Skills.tsx';
import { SKILL_LEVELS, type SkillLevel, addSkill, normalizeSkills } from '../domain/skills.ts';
import { CalendarExplorer } from './CalendarViews.tsx';
import { getCompanies, getCompany } from '../domain/model.ts';
import CalendarEditor from './CalendarEditor.tsx';
import PersonalDetailsEditor from './PersonalDetailsEditor.tsx';
import { useRef, useState, type FormEvent } from 'react';
import { SheetPanel, SheetTabs, type SheetTab } from './SheetTabs.tsx';
import { useApp, type ModalState } from '../context.tsx';
import {
  DAYS,
  createId,
  checkAvailability,
  publishStudent,
  requestSelection,
  saveDraft,
  visibleStudents,
  type Student,
  type StudentDetails,
} from '../domain/model.ts';
import { initialStore } from '../domain/fixtures.ts';
import { profileReading } from '../domain/reading.ts';
import { proposeBrief } from '../domain/brief.ts';
import { Avatar, Badge, Button, Empty, Icon, Modal, Week, dateLabel } from './ui.tsx';

type ProfileTab = 'overview' | 'skills' | 'cv' | 'calendar';

function Profile({ studentId, needId }: { studentId: string; needId: string }) {
  const { store, setStore, openModal, closeModal, notify } = useApp();
  const [tab, setTab] = useState<ProfileTab>('overview');
  const panel = useRef<HTMLDivElement>(null);
  const need = store.needs.find((n) => n.id === needId);
  const student = need && visibleStudents(store, need).find((s) => s.id === studentId);
  if (!need || !student)
    return (
      <Modal title="Profil indisponible" onClose={closeModal}>
        <Empty title="Ce profil n’est plus accessible">
          Le profil a été retiré ou votre besoin est fermé. Votre conseillère peut vous aider à
          poursuivre la recherche.
        </Empty>
      </Modal>
    );
  const data = student.published!;
  const calendar = store.calendars.find((c) => c.id === data.trainingId);
  const checks = checkAvailability(data, calendar, need);
  const reading = profileReading(student, need, store.calendars);
  const selected = need.selected.includes(student.id);
  const tabs: SheetTab<ProfileTab>[] = [
    { id: 'overview', label: 'Vue d’ensemble' },
    { id: 'skills', label: 'Compétences' },
    { id: 'cv', label: 'CV anonymisé' },
    { id: 'calendar', label: 'Calendrier' },
  ];
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
    notify(selected ? 'Profil retiré de la sélection' : `${data.firstName} ajouté à la sélection`);
  };
  return (
    <Modal title="Le talent, au-delà du CV" onClose={closeModal} wide sheet>
      <div className="sheet-head">
        <div className="profile-header">
          <Avatar variant={student.avatar} />
          <div>
            <div className="profile-title">
              <h3>{data.firstName}</h3>
              <Badge tone="green">Fiche validée par le centre</Badge>
            </div>
            <p>{calendar?.title}</p>
            <span>
              <Icon name="pin" size={16} />
              {data.location} · {data.mobility || 'Mobilité à vérifier'}
            </span>
          </div>
        </div>
        <SheetTabs
          id="profile"
          label="Rubriques du profil"
          tabs={tabs}
          active={tab}
          onChange={(next) => {
            setTab(next);
            panel.current?.scrollTo({ top: 0 });
          }}
        />
      </div>
      <div className="sheet-panel" ref={panel}>
        <SheetPanel id="profile" tab="overview" active={tab}>
          <section className="match-explanation">
            <h3>
              <Icon name="spark" /> Pourquoi ce profil pour votre besoin ?
            </h3>
            <p>{reading.why}</p>
            {reading.declic && (
              <p className="declic-note">
                <strong>Déclic Glimlink</strong> {reading.declic}
              </p>
            )}
            <ul className="fact-chips" aria-label="Ce qui ressort">
              {reading.highlights.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </section>
          <div className="overview-grid">
            <section className="profile-section">
              <h4>
                <Icon name="brief" size={17} /> En lien avec vos missions
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
            </section>
            <section className="profile-section">
              <h4>
                <Icon name="calendar" size={17} /> Disponibilité et conditions
              </h4>
              <div className="profile-facts">
                <span>
                  <strong>Disponibilité</strong>
                  {dateLabel(data.availableFrom)}
                </span>
                <span>
                  <strong>Permis B</strong>
                  {data.license === 'yes'
                    ? 'Renseigné'
                    : data.license === 'no'
                      ? 'Non détenu'
                      : 'Non renseigné'}
                </span>
                <span>
                  <strong>Mobilité</strong>
                  {data.mobility || 'À vérifier'}
                </span>
              </div>
              {checks.length > 0 && (
                <ul className="check-list">
                  {checks.map((check, i) => (
                    <li key={i} className={`check-${check.kind}`}>
                      <Icon name={check.kind === 'ok' ? 'check' : 'alert'} size={17} />
                      <span>{check.text}</span>
                      <Badge tone={check.kind === 'ok' ? 'green' : 'warning'}>
                        {check.kind === 'ok'
                          ? 'Renseigné'
                          : check.kind === 'unknown'
                            ? 'À vérifier'
                            : 'Conflit'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
          <p className="micro">
            Lecture simulée à partir de la fiche validée. L’ordre de présentation reste interne :
            aucun score n’est affiché. La disponibilité reste à confirmer avec le conseiller.
          </p>
        </SheetPanel>
        <SheetPanel id="profile" tab="skills" active={tab}>
          <div className="reading-columns">
            <section>
              <h4>Ce que la fiche prouve</h4>
              <SkillList
                skills={data.skills.filter((skill) => skill.status === 'acquired')}
                calendars={store.calendars}
              />
              <p>{data.experience}</p>
            </section>
            <section>
              <h4>Ce qui peut être transféré ou est en cours</h4>
              {reading.transferable.length ? (
                <SkillList
                  skills={data.skills.filter((skill) => skill.status === 'learning')}
                  calendars={store.calendars}
                />
              ) : (
                <p className="micro">Aucune compétence en cours d’acquisition renseignée.</p>
              )}
              <p className="micro">
                Une piste transférable n’est jamais présentée comme une compétence certaine.
              </p>
            </section>
          </div>
        </SheetPanel>
        <SheetPanel id="profile" tab="cv" active={tab}>
          <div className="demo-cv">
            <Badge>CV anonymisé · Exemple fictif</Badge>
            <h3>{data.firstName}</h3>
            <p>
              {calendar?.title} · {data.location}
            </p>
            <h4>Compétences</h4>
            <SkillList skills={data.skills} calendars={store.calendars} />
            <h4>Expérience</h4>
            <p>{data.experience}</p>
            <p className="micro">
              Nom, téléphone, e-mail et adresse précise sont masqués. L’anonymisation de vrais CV
              devra être réalisée et vérifiée côté serveur.
            </p>
          </div>
        </SheetPanel>
        <SheetPanel id="profile" tab="calendar" active={tab}>
          <section className="profile-section">
            <p className="micro">
              {need.requiredDays.length
                ? `Votre présence obligatoire (${need.requiredDays.join(', ')}) est comparée à ce calendrier.`
                : 'Vous n’avez exprimé aucune présence obligatoire : ce calendrier n’a pas servi à la recherche et reste consultable.'}
            </p>
            {calendar && tab === 'calendar' && (
              <CalendarExplorer calendar={calendar} initialDate={need.start} availability={data} />
            )}
            <details>
              <summary>Rythme hebdomadaire de référence</summary>
              <Week
                calendar={calendar}
                required={need.requiredDays}
                unavailable={data.unavailableDays}
              />
            </details>
          </section>
        </SheetPanel>
      </div>
      <footer className="sheet-footer">
        <span className="sheet-footer-note">
          <Icon name="shield" size={16} /> La mise en relation passe par Mathilde.
        </span>
        <div className="sheet-actions">
          {selected && (
            <Button
              variant="secondary"
              onClick={() => openModal({ kind: 'request', needId: need.id })}
            >
              Faire le lien
            </Button>
          )}
          <Button onClick={toggle}>
            <Icon name={selected ? 'check' : 'heart'} />
            {selected ? 'Retirer de la sélection' : 'Ajouter à ma sélection'}
          </Button>
        </div>
      </footer>
    </Modal>
  );
}

function RequestModal({ needId }: { needId: string }) {
  const { store, setStore, closeModal, notify, go } = useApp();
  const [message, setMessage] = useState('');
  const need = store.needs.find((n) => n.id === needId);
  if (!need) return null;
  const students = visibleStudents(store, need).filter((s) => need.selected.includes(s.id));
  const stale = need.selected.length - students.length;
  const duplicate = store.requests.some(
    (r) =>
      r.needId === needId &&
      r.studentIds.length === students.length &&
      students.every((s) => r.studentIds.includes(s.id)),
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!students.length || duplicate) return;
    setStore((prev) => requestSelection(prev, needId, message.trim()));
    closeModal();
    go('requests');
    notify('Demande enregistrée pour Mathilde. Aucun e-mail envoyé dans cette maquette.');
  };
  return (
    <Modal title="Confier la rencontre à Mathilde" onClose={closeModal}>
      <p className="modal-intro">
        Votre conseillère échange avec vous, contacte les étudiants et organise les entretiens.
      </p>
      <div className="request-summary">
        <strong>{need.title}</strong>
        <div className="requested-students">
          {students.map((s) => (
            <span key={s.id}>
              <Avatar variant={s.avatar} small />
              {s.published!.firstName}
            </span>
          ))}
        </div>
      </div>
      {stale > 0 && (
        <p className="notice notice-warning">
          {stale} profil(s) retiré(s) du vivier : ils ne seront pas inclus dans la demande.
        </p>
      )}
      <form onSubmit={submit}>
        <label>
          Un message pour votre conseillère (facultatif)
          <textarea
            name="message"
            autoComplete="off"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Vos préférences pour un premier échange…"
          />
        </label>
        <p className="notice">
          <Icon name="shield" size={18} /> Les coordonnées étudiantes restent confidentielles.
        </p>
        {duplicate && (
          <p className="notice notice-warning">
            Cette sélection a déjà été transmise. Vous pouvez suivre la demande dans votre tableau
            de bord.
          </p>
        )}
        {!students.length && (
          <p className="form-error">Aucun profil actuellement accessible dans cette sélection.</p>
        )}
        <div className="form-footer">
          <Button variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button type="submit" disabled={!students.length || duplicate}>
            Demander une mise en relation <Icon name="arrow" size={17} />
          </Button>
        </div>
      </form>
    </Modal>
  );
}

const FIELD_LABELS: Record<keyof StudentDetails, string> = {
  firstName: 'Prénom',
  location: 'Localisation',
  mobility: 'Mobilité',
  trainingId: 'Formation',
  skills: 'Compétences',
  experience: 'Expérience',
  license: 'Permis',
  availableFrom: 'Disponibilité',
  unavailableDays: 'Indisponibilités',
  note: 'Observations',
};

type EditorSection = 'identity' | 'training' | 'skills' | 'story' | 'contact' | 'publish';

function StudentEditor({ studentId }: { studentId: string }) {
  const { store, setStore, closeModal, notify, role } = useApp();
  const student = store.students.find((s) => s.id === studentId && s.school === 'campus-a');
  const [draft, setDraft] = useState<StudentDetails | null>(
    student ? structuredClone(student.draft) : null,
  );
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [withdraw, setWithdraw] = useState(false);
  const [proposeCv, setProposeCv] = useState(false);
  const [highlight, setHighlight] = useState(!!student?.highlight);
  const [section, setSection] = useState<EditorSection>('identity');
  const panel = useRef<HTMLDivElement>(null);
  if (!student || !draft || role !== 'adviser')
    return (
      <Modal title="Fiche inaccessible" onClose={closeModal}>
        <p>Cette fiche ne fait pas partie de votre périmètre.</p>
      </Modal>
    );
  const calendar = store.calendars.find((c) => c.id === draft.trainingId);
  const published = student.published;
  const pending = published
    ? (Object.keys(draft) as (keyof StudentDetails)[]).filter(
        (key) => JSON.stringify(draft[key]) !== JSON.stringify(published[key]),
      )
    : [];
  const changed = (...keys: (keyof StudentDetails)[]) => keys.some((key) => pending.includes(key));
  const skillCount = normalizeSkills(draft.skills).length;
  const toAssess = draft.skills.filter((skill) => skill.level === 'unknown').length;
  const sections: SheetTab<EditorSection>[] = [
    {
      id: 'identity',
      label: 'Identité',
      tone: draft.firstName.trim() && draft.location && draft.mobility ? 'ok' : 'todo',
      hint: !draft.firstName.trim() || !draft.location
        ? 'Prénom ou lieu manquant'
        : draft.mobility
          ? draft.location
          : 'Mobilité à vérifier',
      changed: changed('firstName', 'location', 'mobility'),
    },
    {
      id: 'training',
      label: 'Formation & rythme',
      tone: draft.trainingId && calendar?.mode === 'weekly' && draft.license !== 'unknown' ? 'ok' : 'todo',
      hint: !draft.trainingId
        ? 'Formation à choisir'
        : calendar?.mode !== 'weekly'
          ? 'Calendrier à vérifier'
          : draft.license === 'unknown'
            ? 'Permis à vérifier'
            : `Dès le ${dateLabel(draft.availableFrom)}`,
      changed: changed('trainingId', 'availableFrom', 'license', 'unavailableDays'),
    },
    {
      id: 'skills',
      label: 'Compétences',
      tone: skillCount && !toAssess ? 'ok' : 'todo',
      hint: !skillCount
        ? 'Aucune compétence'
        : `${skillCount} renseignée${skillCount > 1 ? 's' : ''}${toAssess ? ` · ${toAssess} à évaluer` : ''}`,
      changed: changed('skills'),
    },
    {
      id: 'story',
      label: 'Parcours & regard',
      tone: draft.experience.trim() ? 'ok' : 'todo',
      hint: !draft.experience.trim()
        ? 'Expérience à préciser'
        : highlight
          ? 'Profil à valoriser'
          : 'Expérience renseignée',
      changed: changed('experience', 'note'),
    },
    { id: 'contact', label: 'Coordonnées privées', hint: 'Jamais publiées' },
    {
      id: 'publish',
      label: 'Publication',
      tone: confirmed ? 'ok' : 'todo',
      hint: pending.length
        ? `${pending.length} correction${pending.length > 1 ? 's' : ''} à valider`
        : student.status === 'published'
          ? 'Version publiée à jour'
          : 'À vérifier puis publier',
    },
  ];
  const current = sections.findIndex((item) => item.id === section);
  const next = sections[current + 1];
  const select = (target: EditorSection) => {
    setSection(target);
    panel.current?.scrollTo({ top: 0 });
  };
  const patch = (data: Partial<StudentDetails>) => {
    setDraft({ ...draft, ...data });
    setConfirmed(false);
    setError('');
  };
  const save = () => {
    setStore((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...saveDraft(s, draft), highlight } : s,
      ),
    }));
    notify('Brouillon enregistré. La fiche publiée reste inchangée.');
  };
  // L’erreur reste affichée dans la barre d’actions et la rubrique concernée s’ouvre.
  const fail = (message: string, target: EditorSection, focus: string) => {
    setError(message);
    select(target);
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`#editor-panel-${target} ${focus}`)?.focus(),
    );
  };
  const publish = (e: FormEvent) => {
    e.preventDefault();
    const missing = 'Renseignez un prénom, une formation et au moins une compétence.';
    if (!draft.firstName.trim()) return fail(missing, 'identity', '#student-firstName');
    if (!draft.trainingId) return fail(missing, 'training', 'button, select');
    if (!skillCount) return fail(missing, 'skills', 'input');
    if (!confirmed)
      return fail(
        'Confirmez le contrôle des données destinées aux entreprises avant la publication.',
        'publish',
        '#student-confirmation',
      );
    setStore((prev) =>
      publishStudent(
        {
          ...prev,
          students: prev.students.map((s) =>
            s.id === studentId
              ? { ...saveDraft(s, { ...draft, skills: normalizeSkills(draft.skills) }), highlight }
              : s,
          ),
        },
        studentId,
      ),
    );
    closeModal();
    notify('Fiche validée et publiée dans le vivier autorisé.');
  };
  const display = (key: keyof StudentDetails, value: unknown) => {
    if (key === 'license')
      return value === 'yes' ? 'Renseigné' : value === 'no' ? 'Non détenu' : 'À vérifier';
    if (key === 'trainingId')
      return store.calendars.find((c) => c.id === value)?.title ?? 'Non renseignée';
    if (key === 'availableFrom') return dateLabel(String(value ?? ''));
    return Array.isArray(value)
      ? value
          .map((v) =>
            typeof v === 'object' && v
              ? `${v.name} (${SKILL_LEVELS[v.level as SkillLevel] ?? 'À évaluer'}, ${v.status === 'learning' ? 'en acquisition' : 'acquise'})`
              : v,
          )
          .join(', ') || 'Aucune'
      : String(value || 'Non renseigné');
  };
  return (
    <Modal title="Vérifier et enrichir la fiche" onClose={closeModal} wide sheet>
      <div className="editor-header sheet-head">
        <Avatar variant={student.avatar} small />
        <div>
          <h3>
            {draft.firstName || 'Nouveau talent'} {student.personalDetails?.lastName}
          </h3>
          <p>Atelier Campus · Conseillère : Mathilde JEANNE</p>
        </div>
        <Badge tone={student.status === 'published' ? 'green' : 'warning'}>
          {student.status === 'published'
            ? 'Version publiée conservée'
            : student.status === 'withdrawn'
              ? 'Retiré du vivier'
              : 'Brouillon privé'}
        </Badge>
      </div>
      <div className="sheet-layout">
        <SheetTabs
          id="editor"
          label="Rubriques de la fiche candidat"
          tabs={sections}
          active={section}
          onChange={select}
          vertical
        />
        <div className="sheet-panel" ref={panel}>
          <SheetPanel id="editor" tab="contact" active={section}>
            <PersonalDetailsEditor student={student} />
          </SheetPanel>
          <form id="student-form" onSubmit={publish}>
            <SheetPanel id="editor" tab="identity" active={section}>
              <h3 className="sheet-title">Identité visible des entreprises</h3>
              <p className="micro">
                Seuls le prénom, la localisation générale et la mobilité sont publiés. Nom et
                coordonnées restent dans la rubrique privée.
              </p>
              <div className="form-grid">
                <label htmlFor="student-firstName">
                  Prénom
                  <input
                    id="student-firstName"
                    name="firstName"
                    autoComplete="off"
                    value={draft.firstName}
                    maxLength={80}
                    onChange={(e) => patch({ firstName: e.target.value })}
                  />
                </label>
                <label>
                  Localisation générale
                  <ChoiceSelect
                    name="location"
                    value={draft.location}
                    options={LOCATION_CHOICES}
                    allowCustom
                    onChange={(location) => patch({ location })}
                  />
                </label>
              </div>
              <label>
                Mobilité du candidat
                <ChoiceSelect
                  name="mobility"
                  options={CANDIDATE_MOBILITY}
                  value={draft.mobility ?? ''}
                  placeholder="À vérifier"
                  onChange={(mobility) => patch({ mobility })}
                />
                <small>
                  Distance acceptée depuis le domicile. Choisir uniquement une mobilité confirmée
                  avec le candidat ; le permis reste une information distincte.
                </small>
              </label>
            </SheetPanel>
            <SheetPanel id="editor" tab="training" active={section}>
              <h3 className="sheet-title">Formation, rythme et disponibilité</h3>
              <label>
                Formation / promotion
                <Select
                  name="trainingId"
                  value={draft.trainingId}
                  onChange={(e) => patch({ trainingId: e.target.value })}
                >
                  <option value="">Sélectionner une formation</option>
                  {store.calendars
                    .filter((c) => c.school === student.school)
                    .map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.title}
                      </option>
                    ))}
                </Select>
              </label>
              <section className="inherited-calendar">
                <div>
                  <Icon name="calendar" />
                  <strong>Calendrier hérité automatiquement</strong>
                  <Badge tone={calendar?.mode === 'weekly' ? 'green' : 'warning'}>
                    {calendar?.mode === 'weekly' ? 'Renseigné' : 'À vérifier'}
                  </Badge>
                </div>
                <Week calendar={calendar} unavailable={draft.unavailableDays} />
              </section>
              <div className="form-grid">
                <label>
                  Disponible à partir du
                  <input
                    name="availableFrom"
                    type="date"
                    value={draft.availableFrom}
                    onChange={(e) => patch({ availableFrom: e.target.value })}
                  />
                </label>
                <label>
                  Permis B
                  <Select
                    name="license"
                    aria-label="Permis B"
                    value={draft.license}
                    onChange={(e) =>
                      patch({ license: e.target.value as StudentDetails['license'] })
                    }
                  >
                    <option value="unknown">Non renseigné</option>
                    <option value="yes">Oui, vérifié</option>
                    <option value="no">Non détenu</option>
                  </Select>
                </label>
              </div>
              <fieldset>
                <legend>Indisponibilités individuelles connues</legend>
                <div className="day-toggles">
                  {DAYS.map((day) => (
                    <label
                      key={day}
                      className={draft.unavailableDays.includes(day) ? 'checked' : ''}
                    >
                      <input
                        name="unavailableDays"
                        type="checkbox"
                        checked={draft.unavailableDays.includes(day)}
                        onChange={(e) =>
                          patch({
                            unavailableDays: e.target.checked
                              ? [...draft.unavailableDays, day]
                              : draft.unavailableDays.filter((d) => d !== day),
                          })
                        }
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </fieldset>
            </SheetPanel>
            <SheetPanel id="editor" tab="skills" active={section}>
              <SkillsEditor
                skills={draft.skills}
                trainingId={draft.trainingId}
                calendars={store.calendars.filter((item) => item.school === student.school)}
                onChange={(skills) => patch({ skills })}
              />
              <div className="new-cv">
                <div>
                  <Icon name="file" />
                  <strong>Une nouvelle version du CV ?</strong>
                </div>
                <Button variant="secondary" onClick={() => setProposeCv(!proposeCv)}>
                  Simuler un nouveau CV
                </Button>
                {proposeCv && (
                  <div className="cv-proposal">
                    <p>
                      <Badge tone="warning">Proposition à confirmer</Badge> Nouvelle compétence
                      proposée : « Outils bureautiques ».
                    </p>
                    <p className="micro">
                      Vos corrections précédentes sont conservées. La proposition reste à évaluer
                      et ne modifie pas la fiche publiée.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        patch({
                          skills: addSkill(draft.skills, {
                            id: createId(),
                            name: 'Outils bureautiques',
                            level: 'unknown',
                            status: 'learning',
                            trainingId: null,
                          }),
                        });
                        setProposeCv(false);
                        notify('Proposition ajoutée au brouillon, à valider avant publication');
                      }}
                    >
                      Accepter dans le brouillon
                    </Button>
                    <Button variant="ghost" onClick={() => setProposeCv(false)}>
                      Ignorer
                    </Button>
                  </div>
                )}
              </div>
            </SheetPanel>
            <SheetPanel id="editor" tab="story" active={section}>
              <h3 className="sheet-title">Parcours et connaissance humaine</h3>
              <label>
                Expérience pertinente
                <textarea
                  name="experience"
                  autoComplete="off"
                  rows={4}
                  value={draft.experience}
                  onChange={(e) => patch({ experience: e.target.value })}
                />
              </label>
              <fieldset className="human-knowledge">
                <legend>Connaissance humaine (facultatif)</legend>
                <label>
                  Observations factuelles après entretien
                  <textarea
                    name="note"
                    autoComplete="off"
                    rows={3}
                    value={draft.note}
                    placeholder="Ex. : aisance orale observée, projet professionnel construit, écoute…"
                    onChange={(e) => patch({ note: e.target.value })}
                  />
                  <small>
                    Uniquement des faits observés. Glimlink les reprend dans une formulation neutre,
                    sans rubrique dédiée ni qualité supposée.
                  </small>
                </label>
                <label className="checkbox-label">
                  <input
                    name="highlight"
                    type="checkbox"
                    checked={highlight}
                    onChange={(e) => setHighlight(e.target.checked)}
                  />{' '}
                  Profil à valoriser (signal interne)
                </label>
                <small className="micro">
                  À utiliser exceptionnellement. Le signal reste invisible pour l’entreprise ; il
                  compte seulement dans l’ordre de présentation.
                </small>
              </fieldset>
            </SheetPanel>
            <SheetPanel id="editor" tab="publish" active={section}>
              <h3 className="sheet-title">Fiche destinée aux entreprises</h3>
              <p className="notice">
                <Icon name="file" size={18} /> Les propositions issues du CV nécessitent votre
                vérification. La fiche validée est la référence du matching.
              </p>
              <ul className="publish-review">
                {sections
                  .filter((item) => item.tone)
                  .filter((item) => item.id !== 'publish')
                  .map((item) => (
                    <li key={item.id}>
                      <span className={`sheet-dot sheet-dot-${item.tone}`} aria-hidden="true" />
                      <button type="button" className="text-button" onClick={() => select(item.id)}>
                        {item.label}
                      </button>
                      <small>{item.hint}</small>
                    </li>
                  ))}
              </ul>
              {pending.length > 0 && (
                <details className="pending-comparison" open>
                  <summary>Corrections en attente de publication</summary>
                  <p>La version entreprise est conservée jusqu’à votre validation.</p>
                  <ul>
                    {pending.map((key) => (
                      <li key={key}>
                        <strong>{FIELD_LABELS[key] ?? key}</strong>
                        <p>Publié : {display(key, published![key])}</p>
                        <p>À valider : {display(key, draft[key])}</p>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <label className="confirmation-box">
                <input
                  id="student-confirmation"
                  name="confirmed"
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => {
                    setConfirmed(e.target.checked);
                    setError('');
                  }}
                />
                <span>
                  <strong>J’ai vérifié les informations à publier.</strong>
                  <small>Compétences, disponibilité, calendrier et observations sont contrôlés.</small>
                </span>
              </label>
              {student.status === 'published' && (
                <div className="withdraw-block">
                  {withdraw ? (
                    <>
                      <p>
                        Ce talent a trouvé son contrat ? Le retrait le masque des nouveaux
                        résultats et empêche les nouvelles mises en relation.
                      </p>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setStore((prev) => ({
                            ...prev,
                            students: prev.students.map((s) =>
                              s.id === studentId ? { ...s, status: 'withdrawn' } : s,
                            ),
                          }));
                          closeModal();
                          notify('Profil retiré du vivier. Les demandes existantes sont signalées.');
                        }}
                      >
                        Confirmer le retrait
                      </Button>
                      <Button variant="ghost" onClick={() => setWithdraw(false)}>
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="text-button danger"
                      onClick={() => setWithdraw(true)}
                    >
                      Le talent est placé · retirer du vivier
                    </button>
                  )}
                </div>
              )}
            </SheetPanel>
          </form>
        </div>
      </div>
      <footer className="sheet-footer">
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {next && (
          <button type="button" className="text-button sheet-next" onClick={() => select(next.id)}>
            Suivant<span className="sheet-next-label"> : {next.label}</span>
            <Icon name="arrow" size={16} />
          </button>
        )}
        <div className="sheet-actions">
          <Button variant="secondary" onClick={save}>
            <span>
              Enregistrer<span className="sheet-long"> le brouillon</span>
            </span>
          </Button>
          <Button type="submit" form="student-form">
            <Icon name="check" size={17} /> Valider et publier
          </Button>
        </div>
      </footer>
    </Modal>
  );
}

function ImportCv() {
  const { setStore, openModal, closeModal, role } = useApp();
  const [file, setFile] = useState('');
  const [name, setName] = useState('');
  const [sample, setSample] = useState(false);
  const [error, setError] = useState('');
  if (role !== 'adviser') return null;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Indiquez le prénom du talent pour créer le brouillon.');
      document.getElementById('import-name')?.focus();
      return;
    }
    const id = createId();
    const draft: StudentDetails = sample
      ? {
          ...structuredClone(initialStore().students.find((s) => s.id === 'draft-zoe')!.draft),
          firstName: name.trim(),
          trainingId: '',
          note: '',
        }
      : {
          firstName: name.trim(),
          location: '',
          trainingId: '',
          skills: [],
          experience: '',
          note: '',
          availableFrom: '',
          unavailableDays: [],
          license: 'unknown',
        };
    const student: Student = {
      id,
      school: 'campus-a',
      status: 'draft',
      draft,
      published: null,
      validatedAt: null,
      avatar: 3,
    };
    setStore((prev) => ({ ...prev, students: [student, ...prev.students] }));
    openModal({ kind: 'student', studentId: id });
  };
  return (
    <Modal title="Un nouveau talent à faire émerger" onClose={closeModal}>
      <form onSubmit={submit}>
        <p>Le dépôt crée un brouillon privé. Vous contrôlez les données avant toute publication.</p>
        <label className="upload-zone">
          <span>
            <Icon name="upload" size={30} />
          </span>
          <strong>{file || 'Choisir un CV de démonstration'}</strong>
          <small>PDF · Fichier conservé sur votre appareil</small>
          <input
            name="cv"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')}
          />
        </label>
        <label className="checkbox-label">
          <input
            name="sample"
            type="checkbox"
            checked={sample}
            onChange={(e) => {
              setSample(e.target.checked);
              if (e.target.checked && !name) setName('Zoé');
            }}
          />{' '}
          Simuler le préremplissage avec un CV fictif
        </label>
        <label htmlFor="import-name">
          Prénom du talent
          <input
            id="import-name"
            name="firstName"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prénom…"
            maxLength={80}
          />
        </label>
        <p className="notice notice-warning">
          Maquette : le fichier n’est ni envoyé ni analysé. Le CV fictif propose des données à
          vérifier ; un fichier choisi ouvre une fiche à compléter manuellement.
        </p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-footer">
          <Button variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button type="submit">
            Créer le brouillon <Icon name="arrow" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Contact({ companyId }: { companyId?: string }) {
  const { store, closeModal, notify, role } = useApp();
  const company = getCompany(store, companyId ?? store.activeCompanyId);
  const adviser = role === 'adviser';
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);
  return (
    <Modal
      title={adviser ? `Échanger avec ${company.name}` : 'Échanger avec votre conseillère'}
      onClose={closeModal}
    >
      <div className="contact-person">
        <span className="adviser-avatar">{adviser ? company.mark : 'MJ'}</span>
        <div>
          <h3>{adviser ? company.contact : 'Mathilde JEANNE'}</h3>
          <p>
            {adviser ? `${company.name} · ${company.position}` : 'Atelier Campus · Montpellier'}
          </p>
          {adviser && (
            <p>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              {company.phone && (
                <>
                  {' '}
                  · <a href={`tel:${company.phone}`}>{company.phone}</a>
                </>
              )}{' '}
              · contact fictif
            </p>
          )}
        </div>
      </div>
      {saved ? (
        <div className="success-panel">
          <Icon name="check" size={30} />
          <h3>Votre message est prêt.</h3>
          <p>La maquette simule cette demande d’échange. Aucun message ni e-mail n’a été envoyé.</p>
          <Button onClick={closeModal}>Revenir à mon espace</Button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
            notify('Demande d’échange simulée');
          }}
        >
          <label>
            Le sujet de votre échange
            <textarea
              name="message"
              autoComplete="off"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Une question sur un profil, un rythme ou votre besoin…"
              maxLength={1500}
            />
          </label>
          <div className="form-footer">
            <Button type="submit">
              Préparer la demande d’échange <Icon name="message" size={17} />
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function Invitation({
  activation = false,
  companyId,
}: {
  activation?: boolean;
  companyId?: string;
}) {
  const { store, setStore, closeModal, openModal } = useApp();
  const [invitedId, setInvitedId] = useState(companyId ?? 'maison-alba');
  const company = getCompany(store, invitedId);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  if (!activation)
    return (
      <Modal title="Inviter une entreprise partenaire" onClose={closeModal}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const id = createId();
            const name = String(data.get('companyName') ?? '').trim();
            const firstNeed = String(data.get('firstNeed') ?? '').trim();
            setStore((prev) => ({
              ...prev,
              // Premier besoin préparé par le conseiller : l’entreprise confirme la reformulation.
              needs:
                firstNeed.length >= 20
                  ? [
                      proposeBrief(firstNeed, {
                        companyId: id,
                        sites: [],
                        places: LOCATION_CHOICES,
                        calendars: prev.calendars,
                      }),
                      ...prev.needs,
                    ]
                  : prev.needs,
              companies: [
                ...getCompanies(prev),
                {
                  id,
                  name,
                  email,
                  mark: name.slice(0, 2).toLowerCase() + '.',
                  sector: 'À compléter',
                  location: 'À compléter',
                  contact: 'À compléter',
                  position: 'À compléter',
                  school: 'campus-a',
                  adviserId: 'mathilde-jeanne',
                  status: 'invited',
                },
              ],
            }));
            setInvitedId(id);
            setStep(1);
          }}
        >
          {step ? (
            <div className="success-panel">
              <Icon name="mail" size={30} />
              <h3>L’invitation de démonstration est prête.</h3>
              <p>Destinataire fictif : {email}. Aucun e-mail n’a été envoyé.</p>
              <Button onClick={() => openModal({ kind: 'activation', companyId: invitedId })}>
                Explorer l’activation du compte
              </Button>
            </div>
          ) : (
            <>
              <label>
                Raison sociale
                <input
                  name="companyName"
                  autoComplete="organization"
                  required
                  placeholder="Nom de l’entreprise…"
                />
              </label>
              <label>
                E-mail professionnel du contact
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@entreprise.fr…"
                />
              </label>
              <label>
                Vivier autorisé
                <Select name="school">
                  <option>Atelier Campus · Montpellier</option>
                </Select>
              </label>
              <label>
                Premier besoin (facultatif)
                <textarea
                  name="firstNeed"
                  rows={3}
                  maxLength={2000}
                  placeholder="Les missions évoquées avec l’entreprise, avec ses mots…"
                />
                <small>
                  Glimlink prépare une reformulation que l’entreprise vérifiera et confirmera avant
                  toute recherche.
                </small>
              </label>
              <p className="micro">
                Un utilisateur par entreprise en V1. Invitation de démonstration, sans envoi.
              </p>
              <div className="form-footer">
                <Button type="submit">
                  Préparer l’invitation <Icon name="mail" size={17} />
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    );
  return (
    <Modal title="Votre accès partenaire Glimlink" onClose={closeModal}>
      {step === 2 ? (
        <div className="success-panel">
          <Icon name="shield" size={32} />
          <h3>Bienvenue dans votre espace partenaire.</h3>
          <p>
            Votre conseiller référent est informé de votre inscription et pourra vous appeler pour
            vous présenter Glimlink.
          </p>
          <Button onClick={closeModal}>Fermer l’aperçu</Button>
        </div>
      ) : step === 1 ? (
        <div className="success-panel">
          <Icon name="mail" size={32} />
          <h3>Vérifiez votre adresse professionnelle.</h3>
          <p>
            Dans l’application, un lien de vérification sera envoyé à votre adresse. Ici, vous
            pouvez simuler sa confirmation.
          </p>
          <Button
            onClick={() => {
              setStore((prev) => activatePartner(prev, invitedId));
              setStep(2);
            }}
          >
            Simuler la vérification de l’e-mail
          </Button>
        </div>
      ) : (
        <>
          <Badge tone="green">Sur invitation du centre</Badge>
          <h3>Votre entreprise, en quelques informations.</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const fields = Object.fromEntries(
                ['siret', 'address', 'sector', 'contact', 'position', 'phone', 'email'].map(
                  (key) => [key, String(data.get(key) ?? '').trim()],
                ),
              );
              const name = String(data.get('companyName') ?? '').trim();
              setStore((prev) => ({
                ...prev,
                companies: getCompanies(prev).map((c) =>
                  c.id === invitedId
                    ? {
                        ...c,
                        ...fields,
                        name,
                        status:
                          c.status === 'invited' || c.status === 'verification'
                            ? 'verification'
                            : 'active',
                      }
                    : c,
                ),
              }));
              setStep(1);
            }}
          >
            <div className="form-grid">
              <label>
                Raison sociale
                <input
                  name="companyName"
                  autoComplete="organization"
                  required
                  defaultValue={company.name}
                />
              </label>
              <label>
                SIRET
                <input
                  name="siret"
                  inputMode="numeric"
                  pattern="[0-9]{14}"
                  required
                  placeholder="14 chiffres…"
                  maxLength={14}
                />
              </label>
            </div>
            <label>
              Adresse professionnelle
              <input
                name="address"
                autoComplete="street-address"
                required
                placeholder="Adresse de l’entreprise…"
              />
            </label>
            <div className="form-grid">
              <label>
                Secteur d’activité
                <ChoiceSelect name="sector" options={SECTOR_CHOICES} required allowCustom />
              </label>
              <label>
                Contact principal
                <input
                  name="contact"
                  autoComplete="name"
                  required
                  defaultValue={company.contact === 'À compléter' ? '' : company.contact}
                />
              </label>
              <label>
                Fonction
                <ChoiceSelect name="position" options={POSITION_CHOICES} required allowCustom />
              </label>
              <label>
                Téléphone
                <input
                  name="phone"
                  autoComplete="tel"
                  type="tel"
                  required
                  placeholder="Numéro professionnel…"
                />
              </label>
            </div>
            <label>
              E-mail professionnel
              <input
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                required
                placeholder="contact@entreprise.fr…"
              />
            </label>
            <p className="micro">
              Démonstration : les informations sont enregistrées dans ce navigateur. Aucun e-mail
              n’est envoyé.
            </p>
            <div className="form-footer">
              <Button type="submit">
                Vérifier mon e-mail <Icon name="arrow" />
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}

function Help() {
  const { closeModal, go, openModal, role } = useApp();
  return (
    <Modal title="Explorer la maquette V1" onClose={closeModal}>
      <p className="modal-intro">
        Une maquette interactive fondée sur les spécifications fonctionnelles V3 du 7 octobre 2026.
      </p>
      <div className="guide-links">
        {role === 'company' && (
          <>
            <button
              onClick={() => {
                closeModal();
                go('new-need', undefined, 'company');
              }}
            >
              <Icon name="spark" />
              <span>
                <strong>Créer et valider un besoin</strong>
                <small>Phrase libre, reformulation modifiable et confirmation.</small>
              </span>
              <Icon name="arrow" />
            </button>
            <button
              onClick={() => {
                closeModal();
                go('discover', 'need-admin', 'company');
              }}
            >
              <Icon name="heart" />
              <span>
                <strong>Découvrir et sélectionner</strong>
                <small>Raisons, calendriers, réserves et mise en relation.</small>
              </span>
              <Icon name="arrow" />
            </button>
          </>
        )}
        {role === 'adviser' && (
          <>
            <button
              onClick={() => {
                closeModal();
                go('students', undefined, 'adviser');
              }}
            >
              <Icon name="users" />
              <span>
                <strong>Vérifier et publier un talent</strong>
                <small>Brouillons, corrections et retrait du vivier.</small>
              </span>
              <Icon name="arrow" />
            </button>
            <button
              onClick={() => {
                closeModal();
                go('calendars', undefined, 'adviser');
              }}
            >
              <Icon name="calendar" />
              <span>
                <strong>Consulter les calendriers partagés</strong>
                <small>Héritage sur les profils et contrôles de présence.</small>
              </span>
              <Icon name="arrow" />
            </button>
          </>
        )}
        {role === 'admin' && (
          <>
            <button
              onClick={() => {
                closeModal();
                go('calendars', undefined, 'admin');
              }}
            >
              <Icon name="calendar" />
              <span>
                <strong>Gérer les formations et plannings</strong>
                <small>Création, compétences visées et calendrier partagé.</small>
              </span>
              <Icon name="arrow" />
            </button>
            <button
              onClick={() => {
                closeModal();
                go('users', undefined, 'admin');
              }}
            >
              <Icon name="users" />
              <span>
                <strong>Ajouter des utilisateurs</strong>
                <small>Rôles, coordonnées et rattachements.</small>
              </span>
              <Icon name="arrow" />
            </button>
            <button
              onClick={() => {
                closeModal();
                go('companies', undefined, 'admin');
              }}
            >
              <Icon name="brief" />
              <span>
                <strong>Ajouter des entreprises</strong>
                <small>Contacts et coordonnées des partenaires.</small>
              </span>
              <Icon name="arrow" />
            </button>
          </>
        )}
        {role !== 'admin' && (
          <button onClick={() => openModal({ kind: role === 'adviser' ? 'invite' : 'activation' })}>
            <Icon name="shield" />
            <span>
              <strong>Explorer l’accès sur invitation</strong>
              <small>Création du compte et vérification d’e-mail simulées.</small>
            </span>
            <Icon name="arrow" />
          </button>
        )}
      </div>
      <details className="prototype-details">
        <summary>Ce que simule cette maquette</summary>
        <p>
          Données fictives et stockage local au navigateur. Pertinence interne prédéfinie par
          profil et type de besoin, jamais affichée ; reformulation et lecture personnalisée
          simulées par des règles simples ; aucun moteur IA, aucun envoi d’e-mail, aucune
          authentification réelle, aucune analyse de CV.
        </p>
        <p>
          Les contrôles des jours, dates, permis et indisponibilités sont déterministes. Les règles
          d’exclusion, les états des demandes, la granularité du calendrier et les critères de
          publication sont des hypothèses de démonstration à arbitrer en section 20.
        </p>
        <p>
          La confidentialité et le cloisonnement sont illustrés à l’écran ; leur garantie nécessite
          des autorisations côté serveur. Aucun vrai renseignement étudiant n’est embarqué.
        </p>
      </details>
      <div className="form-footer">
        <Button variant="secondary" onClick={() => openModal({ kind: 'reset' })}>
          <Icon name="reset" size={16} /> Réinitialiser la démonstration
        </Button>
        <Button onClick={closeModal}>Explorer la maquette</Button>
      </div>
    </Modal>
  );
}

export default function Modals({ modal }: { modal: ModalState }) {
  const { closeModal, setStore, notify } = useApp();
  switch (modal.kind) {
    case 'notifications':
      return <Notifications />;
    case 'profile':
      return (
        <Profile
          key={`profile-${modal.studentId}`}
          studentId={modal.studentId}
          needId={modal.needId}
        />
      );
    case 'student':
      return <StudentEditor key={modal.studentId} studentId={modal.studentId} />;
    case 'calendar':
      return <CalendarEditor key={modal.calendarId} calendarId={modal.calendarId} />;
    case 'request':
      return <RequestModal key={modal.needId} needId={modal.needId} />;
    case 'import':
      return <ImportCv />;
    case 'contact':
      return <Contact companyId={modal.companyId} />;
    case 'invite':
      return <Invitation />;
    case 'activation':
      return (
        <Invitation
          activation
          companyId={modal.companyId}
          key={`activation-${modal.companyId ?? 'maison-alba'}`}
        />
      );
    case 'help':
      return <Help />;
    case 'reset':
      return (
        <Modal title="Recommencer la démonstration ?" onClose={closeModal}>
          <p>
            Les besoins, sélections et modifications locales seront remplacés par les exemples de
            départ.
          </p>
          <div className="form-footer">
            <Button variant="secondary" onClick={closeModal}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                setStore(initialStore());
                closeModal();
                notify('Démonstration réinitialisée');
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </Modal>
      );
  }
}
