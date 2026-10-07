import { calendarDay, datesBetween, weekdayForDate } from './calendar.ts';
import { normalizeSkills, type StudentSkill, type TrainingSkill } from './skills.ts';
import { partnerCompanies, type PartnerCompany } from './partners.ts';

export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const;
export type Day = (typeof DAYS)[number];
// getRandomValues fonctionne aussi sur une prévisualisation HTTP en réseau local.
export function createId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
        byte.toString(16).padStart(2, '0'),
      ).join('');
}
export type Role = 'company' | 'adviser';
export type Calendar = {
  id: string;
  title: string;
  school: string;
  courseDays: Day[];
  mode: 'weekly' | 'variable' | 'unknown';
  start: string;
  end: string;
  exceptions?: CalendarException[];
  learningSkills?: TrainingSkill[];
};
export type CalendarException = {
  id: string;
  start: string;
  end: string;
  kind: 'course' | 'potential' | 'unknown';
  label: string;
};
export type StudentDetails = {
  firstName: string;
  location: string;
  mobility?: string;
  trainingId: string;
  skills: StudentSkill[];
  experience: string;
  license: 'yes' | 'no' | 'unknown';
  availableFrom: string;
  unavailableDays: Day[];
  note: string;
};
export type Student = {
  id: string;
  school: string;
  status: 'draft' | 'published' | 'withdrawn';
  draft: StudentDetails;
  published: StudentDetails | null;
  validatedAt: string | null;
  validatedBy?: string;
  adviserId?: string;
  avatar: number;
  discoveryReason?: string;
  proposal?: string[];
  personalDetails?: StudentPersonalDetails;
};
export type StudentPersonalDetails = {
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
};
export const EMPTY_PERSONAL_DETAILS: StudentPersonalDetails = {
  lastName: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
};
export type Need = {
  id: string;
  companyId?: string;
  mobility?: string;
  proposedSkills?: string[];
  proposedDomains?: string[];
  title: string;
  description: string;
  contract: string;
  location: string;
  start: string;
  end: string;
  requiredDays: Day[];
  licenseRequired: boolean;
  missions: string[];
  wishes: string;
  schools: string[];
  status: 'active' | 'closed';
  validated: boolean;
  selected: string[];
  passed: string[];
};
export type Request = {
  id: string;
  needId: string;
  studentIds: string[];
  message: string;
  date: string;
  status: 'received' | 'contacting' | 'meeting';
  snapshot?: {
    need: Need;
    students: { id: string; details: StudentDetails; calendar?: Calendar }[];
  };
  adviserId?: string;
  meetingDate?: string;
  followUp?: string;
  adviserNotificationRead?: boolean;
};
export type Alert = { id: string; needId: string; studentId: string; read: boolean; date: string };
export type Store = {
  version: 1;
  students: Student[];
  calendars: Calendar[];
  needs: Need[];
  requests: Request[];
  alerts: Alert[];
  companies?: PartnerCompany[];
  activeCompanyId?: string;
  notificationWelcomeRead?: { companies?: string[]; adviser?: boolean };
};
export type Check = { kind: 'ok' | 'unknown' | 'conflict'; text: string };

export function checkAvailability(
  details: StudentDetails,
  calendar: Calendar | undefined,
  need: Need,
): Check[] {
  const checks: Check[] = [];
  if (!details.availableFrom)
    checks.push({ kind: 'unknown', text: 'Date de disponibilité à vérifier' });
  else if (details.availableFrom > need.start)
    checks.push({ kind: 'conflict', text: 'Disponible après la date de début souhaitée' });
  const requestedDates = datesBetween(need.start, need.end).filter((value) => {
    const day = weekdayForDate(value);
    return day !== null && need.requiredDays.includes(day);
  });
  const conflicts = calendar
    ? requestedDates.filter((value) => calendarDay(calendar, value) === 'course')
    : [];
  const unknownDates = calendar
    ? requestedDates.filter((value) =>
        ['unknown', 'outside'].includes(calendarDay(calendar, value)),
      )
    : requestedDates;
  if (
    !calendar ||
    calendar.start > need.start ||
    calendar.end < need.end ||
    unknownDates.length ||
    (calendar.mode !== 'weekly' && !requestedDates.length)
  ) {
    checks.push({
      kind: 'unknown',
      text:
        calendar?.mode === 'variable'
          ? 'Rythme variable : présence à vérifier sur la période'
          : 'Calendrier absent ou incomplet sur la période',
    });
  }
  if (conflicts.length) {
    const days = [...new Set(conflicts.map((value) => weekdayForDate(value)!))];
    checks.push({
      kind: 'conflict',
      text: `Cours le ${days.map((day) => day.toLowerCase()).join(' et le ')}${calendar?.exceptions?.length ? ` sur ${conflicts.length} date(s) de la période` : ''}`,
    });
  } else if (
    calendar &&
    !unknownDates.length &&
    calendar.start <= need.start &&
    calendar.end >= need.end &&
    (calendar.mode === 'weekly' || requestedDates.length)
  ) {
    checks.push({
      kind: 'ok',
      text: need.requiredDays.length
        ? `Pas de conflit scolaire le ${need.requiredDays.map((day) => day.toLowerCase()).join(' et le ')}`
        : 'Calendrier scolaire renseigné',
    });
  }
  const unavailable = need.requiredDays.filter((day) => details.unavailableDays.includes(day));
  if (unavailable.length)
    checks.push({
      kind: 'conflict',
      text: `Indisponibilité individuelle le ${unavailable.map((x) => x.toLowerCase()).join(' et le ')}`,
    });
  if (need.licenseRequired)
    checks.push(
      details.license === 'yes'
        ? { kind: 'ok', text: 'Permis B renseigné' }
        : details.license === 'no'
          ? { kind: 'conflict', text: 'Permis B non détenu' }
          : { kind: 'unknown', text: 'Permis non renseigné : à vérifier' },
    );
  return checks;
}

export function visibleStudents(store: Store, need: Need): Student[] {
  return need.validated && need.status === 'active'
    ? store.students
        .filter(
          (s) =>
            s.status === 'published' &&
            s.published &&
            need.schools.includes(s.school) &&
            companySchools(store, need.companyId).includes(s.school),
        )
        .map((student) => companyStudent(student)!)
    : [];
}

// Projection explicite : aucune coordonnée ni correction non publiée côté entreprise.
export function companyStudent(student: Student): Student | null {
  if (!student.published || student.status === 'draft') return null;
  const source = student.published;
  const published: StudentDetails = {
    firstName: source.firstName,
    location: source.location,
    mobility: source.mobility,
    trainingId: source.trainingId,
    skills: normalizeSkills(source.skills),
    experience: source.experience,
    license: source.license,
    availableFrom: source.availableFrom,
    unavailableDays: [...source.unavailableDays],
    note: source.note,
  };
  return {
    id: student.id,
    school: student.school,
    status: student.status,
    avatar: student.avatar,
    validatedAt: student.validatedAt,
    validatedBy: student.validatedBy,
    discoveryReason: student.discoveryReason,
    draft: structuredClone(published),
    published,
  };
}

export function companyStore(store: Store): Store {
  const company = getCompany(store, store.activeCompanyId);
  const needs = store.needs.filter((need) => (need.companyId ?? 'maison-alba') === company.id);
  const schools = new Set(companySchools(store, company.id));
  return {
    ...store,
    notificationWelcomeRead: {
      companies: (store.notificationWelcomeRead?.companies ?? []).filter((id) => id === company.id),
    },
    needs: needs.map((need) => ({
      ...need,
      schools: need.schools.filter((school) => schools.has(school)),
    })),
    requests: store.requests
      .filter((request) => needs.some((need) => need.id === request.needId))
      .map(({ followUp: _privateFollowUp, adviserNotificationRead: _privateRead, ...request }) =>
        scopeRequest(
          request,
          store.students.filter((s) => schools.has(s.school)).map((s) => s.id),
          [...schools],
        ),
      ),
    calendars: store.calendars.filter((calendar) => schools.has(calendar.school)),
    alerts: store.alerts.filter((alert) => needs.some((need) => need.id === alert.needId)),
    students: store.students
      .filter((student) => schools.has(student.school))
      .map(companyStudent)
      .filter((student): student is Student => student !== null),
  };
}

export function savePersonalDetails(
  store: Store,
  studentId: string,
  details: StudentPersonalDetails,
  actor: { role: Role; school: string },
): Store {
  if (actor.role !== 'adviser') return store;
  const student = store.students.find(
    (item) => item.id === studentId && item.school === actor.school,
  );
  if (!student) return store;
  const personalDetails = Object.fromEntries(
    Object.keys(EMPTY_PERSONAL_DETAILS).map((key) => [
      key,
      details[key as keyof StudentPersonalDetails].trim(),
    ]),
  ) as StudentPersonalDetails;
  return {
    ...store,
    students: store.students.map((item) =>
      item.id === student.id ? { ...item, personalDetails } : item,
    ),
  };
}

// Valeurs illustratives, par couple besoin / profil. Aucun moteur IA dans cette maquette.
const demoScores: Record<string, number[]> = {
  sophie: [92, 70],
  lucas: [86, 89],
  ines: [79, 82],
  nora: [88, 76],
  adam: [72, 91],
  leo: [68, 62],
  maya: [76, 85],
};
export function scoreFor(student: Student, need: Need): number {
  return demoScores[student.id]?.[need.contract === 'Stage' ? 1 : 0] ?? 74;
}

export function classifyStudent(
  store: Store,
  student: Student,
  need: Need,
): 'main' | 'discover' | 'verify' | 'conflict' {
  const checks = checkAvailability(
    student.published!,
    store.calendars.find((c) => c.id === student.published!.trainingId),
    need,
  );
  if (checks.some((c) => c.kind === 'conflict')) return 'conflict';
  if (checks.some((c) => c.kind === 'unknown')) return 'verify';
  return student.discoveryReason ? 'discover' : scoreFor(student, need) >= 60 ? 'main' : 'verify';
}

export function saveDraft(student: Student, details: StudentDetails): Student {
  return {
    ...student,
    draft: structuredClone({ ...details, skills: normalizeSkills(details.skills) }),
  };
}

export function publishStudent(store: Store, id: string): Store {
  const student = store.students.find((s) => s.id === id);
  if (
    !student ||
    !student.draft.firstName.trim() ||
    !student.draft.trainingId ||
    !normalizeSkills(student.draft.skills).length
  )
    return store;
  const newlyPublished = student.status !== 'published';
  const next: Store = {
    ...store,
    students: store.students.map((s) =>
      s.id === id
        ? {
            ...s,
            published: structuredClone({ ...s.draft, skills: normalizeSkills(s.draft.skills) }),
            status: 'published',
            validatedAt: new Date().toISOString(),
            validatedBy: 'Mathilde JEANNE',
            adviserId: s.adviserId ?? 'mathilde-jeanne',
          }
        : s,
    ),
  };
  if (newlyPublished) {
    for (const need of next.needs.filter(
      (n) => n.status === 'active' && n.validated && n.schools.includes(student.school),
    )) {
      const published = next.students.find((s) => s.id === id)!;
      if (
        classifyStudent(next, published, need) === 'main' &&
        !next.alerts.some((a) => a.studentId === id && a.needId === need.id)
      )
        next.alerts = [
          {
            id: createId(),
            studentId: id,
            needId: need.id,
            date: new Date().toISOString(),
            read: false,
          },
          ...next.alerts,
        ];
    }
  }
  return next;
}

export function requestSelection(store: Store, needId: string, message: string): Store {
  const need = store.needs.find((n) => n.id === needId);
  if (!need || !need.validated || need.status !== 'active') return store;
  const ids = need.selected.filter((id) => visibleStudents(store, need).some((s) => s.id === id));
  if (
    !ids.length ||
    store.requests.some(
      (r) =>
        r.needId === needId &&
        r.studentIds.length === ids.length &&
        ids.every((id) => r.studentIds.includes(id)),
    )
  )
    return store;
  return {
    ...store,
    requests: [
      {
        id: createId(),
        needId,
        studentIds: ids,
        message,
        date: new Date().toISOString(),
        status: 'received',
        adviserId: 'mathilde-jeanne',
        snapshot: {
          need: structuredClone(need),
          students: ids.map((id) => {
            const details = structuredClone(
              companyStudent(store.students.find((s) => s.id === id)!)!.published!,
            );
            return {
              id,
              details,
              calendar: structuredClone(store.calendars.find((c) => c.id === details.trainingId)),
            };
          }),
        },
      },
      ...store.requests,
    ],
  };
}

export function getCompanies(store: Store): PartnerCompany[] {
  return store.companies ?? partnerCompanies;
}
export function companySchools(store: Store, id = 'maison-alba'): string[] {
  const company = getCompanies(store).find((item) => item.id === id);
  return !company || (company.status && company.status !== 'active')
    ? []
    : (company.schools ?? [company.school ?? 'campus-a']);
}
export function getCompany(store: Store, id = 'maison-alba'): PartnerCompany {
  return getCompanies(store).find((company) => company.id === id) ?? partnerCompanies[0];
}
export function pendingCorrections(student: Student): boolean {
  return (
    student.status === 'draft' ||
    (student.status === 'published' &&
      JSON.stringify(student.draft) !== JSON.stringify(student.published))
  );
}
export function adviserNeeds(store: Store, school = 'campus-a'): Need[] {
  return store.needs.filter((need) => need.schools.includes(school));
}
export function adviserRequests(store: Store, school = 'campus-a'): Request[] {
  return store.requests.filter((request) =>
    request.studentIds.some((id) =>
      store.students.some((student) => student.id === id && student.school === school),
    ),
  );
}
export function requestChanges(store: Store, request: Request, school = 'campus-a'): string[] {
  if (!request.snapshot)
    return [
      'Historique de comparaison absent pour cette ancienne demande : revérifiez le brief et les disponibilités.',
    ];
  const changes: string[] = [];
  const need = store.needs.find((n) => n.id === request.needId);
  const brief = (n: Need) =>
    JSON.stringify([
      n.title,
      n.missions,
      n.wishes,
      n.location,
      n.mobility,
      n.proposedSkills,
      n.proposedDomains,
      n.start,
      n.end,
      n.requiredDays,
      n.licenseRequired,
    ]);
  if (need && brief(need) !== brief(request.snapshot.need))
    changes.push('Le brief a été modifié depuis la demande.');
  for (const before of request.snapshot.students) {
    const student = store.students.find((s) => s.id === before.id && s.school === school);
    if (!student) continue;
    if (student.status === 'withdrawn') {
      changes.push(`${before.details.firstName} a été retiré du vivier.`);
      continue;
    }
    const current = student.published;
    if (!current) continue;
    const availability = (d: StudentDetails) =>
      JSON.stringify([d.availableFrom, d.unavailableDays, d.trainingId, d.license, d.mobility]);
    if (availability(current) !== availability(before.details))
      changes.push(
        `${current.firstName} : disponibilités, permis ou mobilité modifiés depuis la demande.`,
      );
    const calendar = store.calendars.find((c) => c.id === current.trainingId);
    const rhythm = (c?: Calendar) =>
      JSON.stringify(c && [c.mode, c.start, c.end, c.courseDays, c.exceptions]);
    if (rhythm(calendar) !== rhythm(before.calendar))
      changes.push(`${current.firstName} : calendrier modifié depuis la demande.`);
  }
  return changes;
}
export function relaxationSuggestions(
  store: Store,
  need: Need,
): { label: string; count: number; need: Need }[] {
  const eligible = (n: Need) =>
    visibleStudents(store, n).filter((s) =>
      ['main', 'discover'].includes(classifyStudent(store, s, n)),
    ).length;
  const count = eligible(need);
  const proposals: { label: string; count: number; need: Need }[] = [];
  const propose = (label: string, alternative: Need) => {
    const gain = eligible(alternative) - count;
    if (gain > 0) proposals.push({ label, count: gain, need: alternative });
  };
  for (const day of need.requiredDays)
    propose(`Rendre la présence du ${day.toLowerCase()} souhaitable`, {
      ...need,
      requiredDays: need.requiredDays.filter((d) => d !== day),
    });
  if (need.licenseRequired)
    propose('Rendre le permis B souhaitable', { ...need, licenseRequired: false });
  if (need.requiredDays.length && need.licenseRequired)
    propose('Revoir ensemble les jours obligatoires et le permis', {
      ...need,
      requiredDays: [],
      licenseRequired: false,
    });
  return proposals;
}

function scopeRequest(request: Request, studentIds: string[], schools: string[]): Request {
  return {
    ...request,
    studentIds: request.studentIds.filter((id) => studentIds.includes(id)),
    snapshot: request.snapshot
      ? {
          need: {
            ...request.snapshot.need,
            schools: request.snapshot.need.schools.filter((school) => schools.includes(school)),
          },
          students: request.snapshot.students.filter((student) => studentIds.includes(student.id)),
        }
      : undefined,
  };
}
export function adviserStore(store: Store, school = 'campus-a'): Store {
  const students = store.students.filter((student) => student.school === school);
  const needs = adviserNeeds(store, school);
  return {
    ...store,
    notificationWelcomeRead: { adviser: store.notificationWelcomeRead?.adviser },
    students,
    needs,
    calendars: store.calendars.filter((calendar) => calendar.school === school),
    requests: adviserRequests(store, school).map((request) =>
      scopeRequest(
        request,
        students.map((student) => student.id),
        [school],
      ),
    ),
    alerts: store.alerts.filter(
      (alert) =>
        needs.some((need) => need.id === alert.needId) &&
        students.some((student) => student.id === alert.studentId),
    ),
    companies: getCompanies(store).filter((company) =>
      (company.schools ?? [company.school ?? 'campus-a']).includes(school),
    ),
  };
}
