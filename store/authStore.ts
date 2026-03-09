// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setToken: (token: string) => void
  clearToken: () => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setToken: (token: string) => set({ token, isAuthenticated: true }),
      clearToken: () => set({ token: null, isAuthenticated: false }),
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'admin-auth',
      onRehydrateStorage: () => (state) => {
        // 👇 Called once localStorage data is loaded into the store
        state?.setHasHydrated(true);
      },
    }
  )
)