import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../types';

export type Theme = 'dark' | 'light';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  role: UserRole;
  currentUserEmail: string;
  setAuth: (auth: { isAuthenticated: boolean; role?: UserRole; email?: string }) => void;
  logout: () => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Admin unlock
  isAdminUnlocked: boolean;
  setAdminUnlocked: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: UserRole.CONSUMER,
      currentUserEmail: '',
      setAuth: ({ isAuthenticated, role, email }) =>
        set((s) => ({
          isAuthenticated,
          ...(role != null && { role }),
          ...(email != null && { currentUserEmail: email }),
        })),
      logout: () =>
        set({
          isAuthenticated: false,
          currentUserEmail: '',
        }),

      theme: 'dark',
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(next);
          }
          return { theme: next };
        }),

      isAdminUnlocked: false,
      setAdminUnlocked: (v) => set({ isAdminUnlocked: v }),
    }),
    {
      name: 'agripresyo-app',
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        role: s.role,
        currentUserEmail: s.currentUserEmail,
        theme: s.theme,
        isAdminUnlocked: s.isAdminUnlocked,
      }),
    }
  )
);
