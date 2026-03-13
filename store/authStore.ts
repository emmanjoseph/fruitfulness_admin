// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Admin {
  id: string
  email: string
  role: string
  createdAt: string
}

interface AuthState {
  token: string | null
  admin: Admin | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setToken: (token: string) => void
  setAdmin: (admin: Admin) => void
  clearToken: () => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null, // ✅ Add default value
      isAuthenticated: false,
      _hasHydrated: false,
      setToken: (token: string) => set({ token, isAuthenticated: true }),
      setAdmin: (admin: Admin) => set({ admin }),
      clearToken: () => set({ token: null, admin: null, isAuthenticated: false }), // ✅ Clear admin too
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'admin-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
)