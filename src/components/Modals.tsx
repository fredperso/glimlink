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
import { useState, type FormEvent } from 'react';
import { useApp, type ModalState } from '../context.tsx';
import {
  DAYS,
  createId,
  checkAvailability,
  publishStudent,
  requestSelection,
  saveDraft,
  scoreFor,
  visibleStudents,
  type Student,
  type StudentDetails,
} from '../domain/model.ts';
import { initialStore } from '../domain/fixtures.ts';
import { Avatar, Badge, Button, Empty, Icon, Modal, Week, dateLabel } from './ui.tsx';

function Profile({ studentId, needId }: { studentId: string; needId: string }) {
  const { store, setStore, openModal, closeModal, notify } = useApp();
  const [cv, setCv] = useState(false);
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
  const selected = need.selected.includes(student.id);
  return (
    <Modal title="Le talent, au-delà du CV" onClose={closeModal} wide>
      <div className="profile-header">
        <Avatar variant={student.avatar} />
        <div>
          <div className="profile-title">
            <h3>{data.firstName}</h3>
            <Badge tone="green">Fiche validée</Badge>
          </div>
          <p>{calendar?.title}</p>
          <span>
            <Icon name="pin" size={16} />
            {data.location} · {data.mobility || 'Mobilité à vérifier'}
          </span>
        </div>
        <span className="profile-score">
          {scoreFor(student, need)}
          <small>% de compatibilité</small>
        </span>
      </div>
      <section className="match-explanation">
        <h3>
          <Icon name="spark" /> Pourquoi ça matche ?
        </h3>
        <p>
          {student.discoveryReason ??
            `Les expériences et compétences validées de ${data.firstName} apportent des points d’appui pour les missions de votre brief.`}
        </p>
        <SkillList skills={data.skills} calendars={store.calendars} />
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
        <p className="micro">
          Score illustratif pour ce besoin, sans valeur de probabilité de recrutement. La
          disponibilité reste à confirmer.
        </p>
      </section>
      <section className="profile-section">
        <h3>
          <Icon name="calendar" /> Son rythme, votre quotidien
        </h3>
        {calendar && (
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
            <strong>Période du calendrier</strong>
            {calendar ? `${dateLabel(calendar.start)} – ${dateLabel(calendar.end)}` : 'À vérifier'}
          </span>
        </div>
      </section>
      <section className="profile-section">
        <h3>
          <Icon name="brief" /> Une expérience à mobiliser
        </h3>
        <p>{data.experience}</p>
      </section>
      <section className="counsellor-note">
        <Icon name="message" />
        <div>
          <strong>Le regard de {student.validatedBy || 'votre conseiller'}</strong>
          <p>{data.note || 'Échangez avec votre conseillère pour en savoir plus.'}</p>
          <small>
            Dernière validation : {dateLabel(student.validatedAt ?? '')} ·{' '}
            {student.validatedBy || 'Validateur non renseigné'}
          </small>
        </div>
      </section>
      <section className="profile-section">
        <button className="button button-secondary" onClick={() => setCv(!cv)} aria-expanded={cv}>
          <Icon name="file" />
          {cv ? 'Masquer le CV de démonstration' : 'Consulter le CV de démonstration'}
        </button>
        {cv && (
          <div className="demo-cv">
            <Badge>Version entreprise · Exemple fictif</Badge>
            <h3>{data.firstName}</h3>
            <p>
              {calendar?.title} · {data.location}
            </p>
            <h4>Compétences validées</h4>
            <SkillList skills={data.skills} calendars={store.calendars} />
            <h4>Expérience</h4>
            <p>{data.experience}</p>
            <p className="micro">
              Les informations personnelles sont absentes de cet exemple. Le traitement de vrais CV
              devra être réalisé et vérifié côté serveur.
            </p>
          </div>
        )}
      </section>
      <div className="modal-footer">
        <span>
          <Icon name="shield" size={16} /> La mise en relation passe par Mathilde.
        </span>
        <Button
          onClick={() => {
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
                ? 'Profil retiré de la sélection'
                : `${data.firstName} ajouté à la sélection`,
            );
          }}
        >
          <Icon name={selected ? 'check' : 'heart'} />
          {selected ? 'Retirer de la sélection' : 'Ajouter à ma sélection'}
        </Button>
        {selected && (
          <Button
            variant="secondary"
            onClick={() => openModal({ kind: 'request', needId: need.id })}
          >
            Faire le lien
          </Button>
        )}
      </div>
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
  if (!student || !draft || role !== 'adviser')
    return (
      <Modal title="Fiche inaccessible" onClose={closeModal}>
        <p>Cette fiche ne fait pas partie de votre périmètre.</p>
      </Modal>
    );
  const calendar = store.calendars.find((c) => c.id === draft.trainingId);
  const patch = (data: Partial<StudentDetails>) => {
    setDraft({ ...draft, ...data });
    setConfirmed(false);
    setError('');
  };
  const save = () => {
    setStore((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === studentId ? saveDraft(s, draft) : s)),
    }));
    notify('Brouillon enregistré. La fiche publiée reste inchangée.');
  };
  const publish = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.firstName.trim() || !draft.trainingId || !normalizeSkills(draft.skills).length) {
      setError('Renseignez un prénom, une formation et au moins une compétence.');
      document.getElementById('student-firstName')?.focus();
      return;
    }
    if (!confirmed) {
      setError('Confirmez le contrôle des données destinées aux entreprises avant la publication.');
      document.getElementById('student-confirmation')?.focus();
      return;
    }
    setStore((prev) =>
      publishStudent(
        {
          ...prev,
          students: prev.students.map((s) =>
            s.id === studentId
              ? saveDraft(s, { ...draft, skills: normalizeSkills(draft.skills) })
              : s,
          ),
        },
        studentId,
      ),
    );
    closeModal();
    notify('Fiche validée et publiée dans le vivier autorisé.');
  };
  return (
    <Modal title="Vérifier et enrichir la fiche" onClose={closeModal} wide>
      <div className="editor-header">
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
      <nav className="editor-section-shortcuts" aria-label="Rubriques de la fiche candidat">
        <Button
          variant="secondary"
          onClick={() =>
            document.getElementById('personal-details-title')?.scrollIntoView({ block: 'start' })
          }
        >
          Coordonnées
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            document.getElementById('skills-title')?.scrollIntoView({ block: 'start' })
          }
        >
          Gérer les compétences
        </Button>
      </nav>
      <PersonalDetailsEditor student={student} />
      <h3 className="public-details-title">Fiche destinée aux entreprises</h3>
      <p className="notice">
        <Icon name="file" size={18} /> Les propositions issues du CV nécessitent votre vérification.
        La fiche validée est la référence du matching.
      </p>
      <form onSubmit={publish}>
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
            Distance acceptée depuis le domicile. Choisir uniquement une mobilité confirmée avec le
            candidat ; le permis reste une information distincte.
          </small>
        </label>
        {student.published && JSON.stringify(draft) !== JSON.stringify(student.published) && (
          <details className="pending-comparison" open>
            <summary>Corrections en attente de publication</summary>
            <p>La version entreprise est conservée jusqu’à votre validation.</p>
            <ul>
              {(Object.keys(draft) as (keyof StudentDetails)[])
                .filter(
                  (key) => JSON.stringify(draft[key]) !== JSON.stringify(student.published![key]),
                )
                .map((key) => {
                  const labels: Record<string, string> = {
                    firstName: 'Prénom',
                    location: 'Localisation',
                    mobility: 'Mobilité',
                    trainingId: 'Formation',
                    skills: 'Compétences',
                    experience: 'Expérience',
                    license: 'Permis',
                    availableFrom: 'Disponibilité',
                    unavailableDays: 'Indisponibilités',
                    note: 'Commentaire',
                  };
                  const display = (value: unknown) => {
                    if (key === 'license')
                      return value === 'yes'
                        ? 'Renseigné'
                        : value === 'no'
                          ? 'Non détenu'
                          : 'À vérifier';
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
                    <li key={key}>
                      <strong>{labels[key] ?? key}</strong>
                      <p>Publié : {display(student.published![key])}</p>
                      <p>À valider : {display(draft[key])}</p>
                    </li>
                  );
                })}
            </ul>
          </details>
        )}
        <label>
          Formation / promotion
          <select
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
          </select>
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
            <select
              name="license"
              aria-label="Permis B"
              value={draft.license}
              onChange={(e) => patch({ license: e.target.value as StudentDetails['license'] })}
            >
              <option value="unknown">Non renseigné</option>
              <option value="yes">Oui, vérifié</option>
              <option value="no">Non détenu</option>
            </select>
          </label>
        </div>
        <fieldset>
          <legend>Indisponibilités individuelles connues</legend>
          <div className="day-toggles">
            {DAYS.map((day) => (
              <label key={day} className={draft.unavailableDays.includes(day) ? 'checked' : ''}>
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
        <SkillsEditor
          skills={draft.skills}
          trainingId={draft.trainingId}
          calendars={store.calendars.filter((item) => item.school === student.school)}
          onChange={(skills) => patch({ skills })}
        />
        <label>
          Expérience pertinente
          <textarea
            name="experience"
            autoComplete="off"
            rows={3}
            value={draft.experience}
            onChange={(e) => patch({ experience: e.target.value })}
          />
        </label>
        <label>
          Commentaire destiné aux entreprises
          <textarea
            name="note"
            autoComplete="off"
            rows={2}
            value={draft.note}
            onChange={(e) => patch({ note: e.target.value })}
          />
        </label>
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
                <Badge tone="warning">Proposition à confirmer</Badge> Nouvelle compétence proposée :
                « Outils bureautiques ».
              </p>
              <p className="micro">
                Vos corrections précédentes sont conservées. La proposition reste à évaluer et ne
                modifie pas la fiche publiée.
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
            <small>Compétences, disponibilité, calendrier et commentaire sont contrôlés.</small>
          </span>
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-footer">
          <Button variant="secondary" onClick={save}>
            Enregistrer le brouillon
          </Button>
          <Button type="submit">
            <Icon name="check" size={17} /> Valider et publier
          </Button>
        </div>
      </form>
      {student.status === 'published' && (
        <div className="withdraw-block">
          {withdraw ? (
            <>
              <p>
                Ce talent a trouvé son contrat ? Le retrait le masque des nouveaux résultats et
                empêche les nouvelles mises en relation.
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
            <button className="text-button danger" onClick={() => setWithdraw(true)}>
              Le talent est placé · retirer du vivier
            </button>
          )}
        </div>
      )}
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
            setStore((prev) => ({
              ...prev,
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
                <select name="school">
                  <option>Atelier Campus · Montpellier</option>
                </select>
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
          <p>Le parcours d’activation est terminé dans cette simulation.</p>
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
              setStore((prev) => ({
                ...prev,
                companies: getCompanies(prev).map((c) =>
                  c.id === invitedId ? { ...c, status: 'active' } : c,
                ),
              }));
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
                <small>Langage naturel, brief modifiable et confirmation.</small>
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
                <strong>Mettre à jour un calendrier partagé</strong>
                <small>Héritage sur les profils et contrôles de présence.</small>
              </span>
              <Icon name="arrow" />
            </button>
          </>
        )}
        <button onClick={() => openModal({ kind: role === 'adviser' ? 'invite' : 'activation' })}>
          <Icon name="shield" />
          <span>
            <strong>Explorer l’accès sur invitation</strong>
            <small>Création du compte et vérification d’e-mail simulées.</small>
          </span>
          <Icon name="arrow" />
        </button>
      </div>
      <details className="prototype-details">
        <summary>Ce que simule cette maquette</summary>
        <p>
          Données fictives et stockage local au navigateur. Scores prédéfinis par profil et type de
          besoin, préremplissage du brief simulé, aucun moteur IA, aucun envoi d’e-mail, aucune
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
