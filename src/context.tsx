import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import type { Role, Store } from './domain/model.ts';
export type ModalState =
  | { kind: 'profile'; studentId: string; needId: string }
  | { kind: 'student'; studentId: string }
  | { kind: 'calendar'; calendarId?: string }
  | { kind: 'request'; needId: string }
  | { kind: 'contact'; companyId?: string }
  | { kind: 'activation'; companyId?: string }
  | { kind: 'help' | 'invite' | 'reset' | 'import' | 'notifications' };
export type AppContextValue = {
  store: Store;
  setStore: Dispatch<SetStateAction<Store>>;
  role: Role;
  view: string;
  needId: string;
  description?: string;
  go: (view: string, needId?: string, role?: Role, description?: string) => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  notify: (text: string) => void;
};
export const AppContext = createContext<AppContextValue | null>(null);
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('Contexte manquant');
  return value;
}
