import { create } from 'zustand'
import type { User } from '../types/auth.types'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const demoUser: User = {
  id: 'user-lucas',
  name: 'Lucas',
  email: 'lucas@sescpe.org.br',
  role: 'gestor_sesc',
  city: 'Recife',
  organization: 'Sesc Pernambuco',
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: demoUser,
  token: 'demo-token',
  isLoading: false,
  login: async (email) => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({ user: { ...demoUser, email }, token: 'demo-token', isLoading: false })
  },
  logout: () => set({ user: null, token: null }),
  updateProfile: async (data) => {
    const user = get().user
    if (user) set({ user: { ...user, ...data } })
  },
}))
