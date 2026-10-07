import { initialStore } from './fixtures.ts';
import { partnerCompanies } from './partners.ts';
import type { Store } from './model.ts';
import { normalizeSkills, TRAINING_SKILLS } from './skills.ts';
const KEY = 'glimlink-prototype-v1';
export function loadStore(): Store {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Store | null;
    if (
      saved?.version === 1 &&
      Array.isArray(saved.students) &&
      Array.isArray(saved.needs) &&
      Array.isArray(saved.calendars) &&
      Array.isArray(saved.requests) &&
      Array.isArray(saved.alerts)
    ) {
      const examples = initialStore().students;
      return {
        ...saved,
        companies: saved.companies ?? structuredClone(partnerCompanies),
        activeCompanyId: saved.activeCompanyId ?? 'maison-alba',
        needs: saved.needs.map((need) => ({ ...need, companyId: need.companyId ?? 'maison-alba' })),
        calendars: saved.calendars.map((calendar) => ({
          ...calendar,
          learningSkills: calendar.learningSkills ?? TRAINING_SKILLS[calendar.id],
        })),
        students: saved.students.map((student) => ({
          ...student,
          draft: { ...student.draft, skills: normalizeSkills(student.draft.skills) },
          published: student.published
            ? { ...student.published, skills: normalizeSkills(student.published.skills) }
            : null,
          personalDetails:
            student.personalDetails ??
            examples.find((item) => item.id === student.id)?.personalDetails,
        })),
      };
    }
  } catch {
    /* Le navigateur peut interdire le stockage. La démo reste utilisable. */
  }
  return initialStore();
}
export function persistStore(store: Store): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}
