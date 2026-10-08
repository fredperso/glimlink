import {
  createId,
  getCompanies,
  type Calendar,
  type ManagedUser,
  type Role,
  type Store,
} from './model.ts';
import { SKILL_LEVELS, skillKey } from './skills.ts';
import type { PartnerCompany } from './partners.ts';

export const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'mathilde-jeanne',
    firstName: 'Mathilde',
    lastName: 'JEANNE',
    email: 'mathilde.jeanne@example.com',
    phone: '04 67 00 00 00',
    address: '12 rue du Campus, 34000 Montpellier',
    role: 'adviser',
    school: 'campus-a',
  },
  {
    id: 'admin-demo',
    firstName: 'Alex',
    lastName: 'Durand',
    email: 'administration@example.com',
    phone: '04 67 00 00 01',
    address: '12 rue du Campus, 34000 Montpellier',
    role: 'admin',
    school: 'campus-a',
  },
];
export function getUsers(store: Store): ManagedUser[] {
  return store.users ?? INITIAL_USERS;
}
const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export function saveTraining(store: Store, training: Calendar, actor: Role): Store {
  const skills = training.learningSkills ?? [];
  if (
    actor !== 'admin' ||
    !training.title.trim() ||
    !training.start ||
    !training.end ||
    training.end < training.start ||
    !skills.length ||
    skills.some((skill) => !skill.name.trim() || !Object.hasOwn(SKILL_LEVELS, skill.targetLevel)) ||
    new Set(skills.map((skill) => skillKey(skill.name))).size !== skills.length ||
    training.exceptions?.some(
      (item) => item.start < training.start || item.end > training.end || item.end < item.start,
    )
  )
    return store;
  const existing = store.calendars.find((item) => item.id === training.id);
  if (existing && existing.school !== training.school) return store;
  const clean = { ...structuredClone(training), title: training.title.trim() };
  return {
    ...store,
    calendars: existing
      ? store.calendars.map((item) => (item.id === training.id ? clean : item))
      : [...store.calendars, clean],
  };
}
export function addManagedUser(store: Store, user: ManagedUser, actor: Role): Store {
  if (
    actor !== 'admin' ||
    !user.firstName.trim() ||
    !user.lastName.trim() ||
    !validEmail(user.email.trim()) ||
    !user.phone.trim() ||
    !user.address.trim() ||
    !['admin', 'adviser', 'company'].includes(user.role) ||
    getUsers(store).some((item) => item.email.toLowerCase() === user.email.trim().toLowerCase()) ||
    (user.role === 'company' && !getCompanies(store).some((item) => item.id === user.companyId))
  )
    return store;
  return {
    ...store,
    users: [
      ...getUsers(store),
      {
        ...user,
        id: createId(),
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        address: user.address.trim(),
        companyId: user.role === 'company' ? user.companyId : undefined,
      },
    ],
  };
}
export function addManagedCompany(store: Store, company: PartnerCompany, actor: Role): Store {
  if (
    actor !== 'admin' ||
    !company.name.trim() ||
    !company.contact.trim() ||
    !validEmail(company.email.trim()) ||
    !company.phone?.trim() ||
    !company.address?.trim() ||
    !company.location.trim() ||
    getCompanies(store).some(
      (item) => item.email.toLowerCase() === company.email.trim().toLowerCase(),
    )
  )
    return store;
  return {
    ...store,
    companies: [
      ...getCompanies(store),
      {
        ...company,
        id: createId(),
        name: company.name.trim(),
        email: company.email.trim(),
        contact: company.contact.trim(),
        status: 'invited',
      },
    ],
  };
}
