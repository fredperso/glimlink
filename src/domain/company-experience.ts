import {
  adviserRequests,
  classifyStudent,
  getCompanies,
  scoreFor,
  visibleStudents,
  type Need,
  type Request,
  type Store,
} from './model.ts';

export function talentAlerts(store: Store, needId?: string) {
  const seen = new Set<string>();
  return store.alerts.filter((alert) => {
    const need = store.needs.find((item) => item.id === alert.needId);
    if (alert.read || !need || (needId && need.id !== needId)) return false;
    const student = visibleStudents(store, need).find((item) => item.id === alert.studentId);
    if (!student || classifyStudent(store, student, need) !== 'main') return false;
    const key = needId ? `${need.id}/${student.id}` : student.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
export function suggestedStudents(store: Store, need: Need) {
  const alerted = new Set(
    store.alerts.filter((alert) => alert.needId === need.id).map((alert) => alert.studentId),
  );
  return visibleStudents(store, need)
    .filter(
      (student) =>
        classifyStudent(store, student, need) === 'main' &&
        !need.selected.includes(student.id) &&
        !need.passed.includes(student.id) &&
        !alerted.has(student.id),
    )
    .sort((a, b) => scoreFor(b, need) - scoreFor(a, need))
    .slice(0, 3);
}
export function needProgress(store: Store, need: Need) {
  const requests = store.requests.filter((request) => request.needId === need.id);
  if (requests.some((request) => request.status === 'completed'))
    return 'Mise en relation effectuée';
  if (need.status === 'closed') return 'Besoin clôturé';
  if (requests.some((request) => request.status === 'meeting')) return 'Entretien à organiser';
  if (requests.some((request) => request.status === 'contacting'))
    return 'Prise de contact en cours';
  if (requests.length) return 'Demande à traiter';
  return need.validated ? 'Profils à explorer' : 'Recherche à confirmer';
}
export function updateRequestStatus(
  store: Store,
  requestId: string,
  status: Request['status'],
): Store {
  const request = adviserRequests(store).find((item) => item.id === requestId);
  if (!request || request.status === 'completed') return store;
  return {
    ...store,
    requests: store.requests.map((item) => (item.id === requestId ? { ...item, status } : item)),
    needs:
      status === 'completed'
        ? store.needs.map((need) =>
            need.id === request.needId ? { ...need, status: 'closed' } : need,
          )
        : store.needs,
  };
}
export function activatePartner(store: Store, companyId: string): Store {
  const company = getCompanies(store).find((item) => item.id === companyId);
  if (!company || company.status !== 'verification') return store;
  return {
    ...store,
    companies: getCompanies(store).map((item) =>
      item.id === companyId
        ? {
            ...item,
            status: 'active',
            adviserId: item.adviserId ?? 'mathilde-jeanne',
            registeredAt: new Date().toISOString(),
            registrationNotificationRead: false,
          }
        : item,
    ),
  };
}
