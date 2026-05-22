import { create } from 'zustand'

export interface AppNotification {
  id: string
  title: string
  body: string
  read: boolean
  createdAt: string
  type: 'interest' | 'confirmation' | 'proposal' | 'logistics' | 'system'
  link?: string
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
  markAllRead: () => void
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void
}

const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Oportunidade de bloco detectada',
    body: '4 unidades têm interesse em Rio de Dentro para julho. Custo 42% menor em bloco.',
    read: false,
    createdAt: '2026-05-21T09:00:00',
    type: 'proposal',
    link: '/circuitos',
  },
  {
    id: 'n2',
    title: 'Rider compatível em Garanhuns',
    body: 'Corpos de Barro cabe no Sesc Garanhuns com 2 itens cobertos localmente. Frete reduz 18%.',
    read: false,
    createdAt: '2026-05-21T10:40:00',
    type: 'system',
    link: '/espetaculos',
  },
  {
    id: 'n3',
    title: 'Sesc Caruaru confirmou participação',
    body: 'Confirmação recebida para o Circuito Bonecos Acesos. 3 de 4 contratantes confirmados.',
    read: false,
    createdAt: '2026-05-21T11:15:00',
    type: 'confirmation',
    link: '/circuitos/circuito-mamulengo',
  },
  {
    id: 'n4',
    title: 'Escola Mestre Vitalino confirmou visita',
    body: '760 alunos aguardam A Peleja do Riso em Caruaru. Kit pedagógico solicitado.',
    read: false,
    createdAt: '2026-05-21T14:00:00',
    type: 'interest',
    link: '/escolas',
  },
  {
    id: 'n5',
    title: 'Consolidação de carga sugerida',
    body: 'Dois grupos partem para o Agreste na mesma semana. Divisão estima economia de R$ 2.400.',
    read: true,
    createdAt: '2026-05-20T16:30:00',
    type: 'logistics',
    link: '/logistica',
  },
  {
    id: 'n6',
    title: 'Sesc Ouricuri demonstrou interesse',
    body: 'Sesc Ouricuri quer receber Lonas Abertas. Município com IAC 12 — prioridade de circulação.',
    read: true,
    createdAt: '2026-05-20T14:00:00',
    type: 'interest',
    link: '/rede',
  },
]

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  activeModal: null,
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n) => !n.read).length,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  markNotificationRead: (id) =>
    set((state) => {
      const next = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      return { notifications: next, unreadCount: next.filter((n) => !n.read).length }
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  addNotification: (n) =>
    set((state) => {
      const newN: AppNotification = {
        ...n,
        id: `notif-${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      }
      const next = [newN, ...state.notifications]
      return { notifications: next, unreadCount: next.filter((item) => !item.read).length }
    }),
}))
