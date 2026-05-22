import { create } from 'zustand'

export interface AppNotification {
  id: string
  title: string
  body: string
  read: boolean
  createdAt: string
}

interface UIStore {
  sidebarCollapsed: boolean
  activeModal: string | null
  notifications: AppNotification[]
  unreadCount: number
  toggleSidebar: () => void
  openModal: (id: string) => void
  closeModal: () => void
  markNotificationRead: (id: string) => void
}

const notifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Nova oportunidade no Sertão',
    body: '4 cidades podem dividir custos para Rio de Dentro.',
    read: false,
    createdAt: '2026-05-21T09:00:00',
  },
  {
    id: 'n2',
    title: 'Rider compatível em Garanhuns',
    body: 'Corpos de Barro cabe no Sesc Garanhuns com 2 itens locais.',
    read: false,
    createdAt: '2026-05-21T10:40:00',
  },
]

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  activeModal: null,
  notifications,
  unreadCount: notifications.filter((notification) => !notification.read).length,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  markNotificationRead: (id) =>
    set((state) => {
      const next = state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      )
      return { notifications: next, unreadCount: next.filter((notification) => !notification.read).length }
    }),
}))
