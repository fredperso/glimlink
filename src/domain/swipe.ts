import { visibleStudents, type Store } from './model.ts';
export type SwipeDecision = { needId: string; studentId: string; direction: 'left' | 'right' };
export function applySwipe(store: Store, decision: SwipeDecision): Store {
  const need = store.needs.find((n) => n.id === decision.needId);
  if (!need || !visibleStudents(store, need).some((s) => s.id === decision.studentId)) return store;
  return {
    ...store,
    needs: store.needs.map((n) =>
      n.id === need.id
        ? {
            ...n,
            selected:
              decision.direction === 'right'
                ? [...new Set([...n.selected, decision.studentId])]
                : n.selected,
            passed:
              decision.direction === 'left'
                ? [...new Set([...n.passed, decision.studentId])]
                : n.passed,
          }
        : n,
    ),
  };
}
export function undoSwipe(store: Store, decision: SwipeDecision): Store {
  return {
    ...store,
    needs: store.needs.map((n) =>
      n.id === decision.needId
        ? {
            ...n,
            selected:
              decision.direction === 'right'
                ? n.selected.filter((id) => id !== decision.studentId)
                : n.selected,
            passed:
              decision.direction === 'left'
                ? n.passed.filter((id) => id !== decision.studentId)
                : n.passed,
          }
        : n,
    ),
  };
}
