import {
  adviserStore,
  companyStore,
  classifyStudent,
  createId,
  getCompany,
  requestSelection,
  visibleStudents,
  type Role,
  type Store,
} from './model.ts';
export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  needId: string;
  studentId?: string;
  simulated?: boolean;
};
export function notifications(store: Store, role: Role): NotificationItem[] {
  const scoped = role === 'company' ? companyStore(store) : adviserStore(store);
  return (
    role === 'company'
      ? scoped.alerts.map((alert) => {
          const need = scoped.needs.find((n) => n.id === alert.needId);
          const student =
            need && visibleStudents(scoped, need).find((s) => s.id === alert.studentId);
          return {
            id: alert.id,
            title: student
              ? `${student.published!.firstName} : un talent à découvrir`
              : 'Une alerte de votre historique',
            message: need?.title ?? 'Besoin indisponible',
            date: alert.date,
            read: alert.read,
            needId: alert.needId,
            studentId: student?.id,
            simulated: alert.id.startsWith('simulation-'),
          };
        })
      : scoped.requests.map((request) => {
          const need = scoped.needs.find((n) => n.id === request.needId);
          return {
            id: request.id,
            title: 'Nouvelle demande de mise en relation',
            message: `${getCompany(scoped, need?.companyId).name} · ${need?.title ?? 'Besoin indisponible'}`,
            date: request.date,
            read: request.adviserNotificationRead ?? false,
            needId: request.needId,
            simulated: request.message.startsWith('[Simulation]'),
          };
        })
  ).sort((a, b) => b.date.localeCompare(a.date));
}
export function readNotifications(store: Store, role: Role, ids: string[]): Store {
  const allowed = new Set(
    notifications(store, role)
      .filter((item) => ids.includes(item.id))
      .map((item) => item.id),
  );
  return role === 'company'
    ? {
        ...store,
        alerts: store.alerts.map((alert) =>
          allowed.has(alert.id) ? { ...alert, read: true } : alert,
        ),
      }
    : {
        ...store,
        requests: store.requests.map((request) =>
          allowed.has(request.id) ? { ...request, adviserNotificationRead: true } : request,
        ),
      };
}
function simulationCandidate(
  store: Store,
  role: Role,
): { needId: string; studentId: string } | undefined {
  const scoped = role === 'company' ? companyStore(store) : adviserStore(store);
  for (const need of scoped.needs) {
    const sourceNeed = store.needs.find((item) => item.id === need.id)!;
    const candidate = visibleStudents(store, sourceNeed).find(
      (student) =>
        (role === 'company' || student.school === 'campus-a') &&
        classifyStudent(store, student, sourceNeed) === 'main' &&
        (role === 'company'
          ? !store.alerts.some(
              (alert) => alert.needId === need.id && alert.studentId === student.id && !alert.read,
            )
          : !store.requests.some(
              (request) =>
                request.needId === need.id &&
                request.studentIds.length === 1 &&
                request.studentIds[0] === student.id,
            )),
    );
    if (candidate) return { needId: need.id, studentId: candidate.id };
  }
}
export function canSimulateNotification(store: Store, role: Role): boolean {
  return !!simulationCandidate(store, role);
}
export function simulateNotification(store: Store, role: Role): Store {
  const candidate = simulationCandidate(store, role);
  if (!candidate) return store;
  if (role === 'company')
    return {
      ...store,
      alerts: [
        {
          id: 'simulation-' + createId(),
          ...candidate,
          date: new Date().toISOString(),
          read: false,
        },
        ...store.alerts,
      ],
    };
  // Une demande simulée conserve le brief validé et les profils publiés, sans modifier la sélection existante.
  const demo = {
    ...store,
    needs: store.needs.map((need) =>
      need.id === candidate.needId ? { ...need, selected: [candidate.studentId] } : need,
    ),
  };
  const next = requestSelection(
    demo,
    candidate.needId,
    '[Simulation] Nous souhaitons rencontrer ce candidat.',
  );
  return { ...next, needs: store.needs };
}
