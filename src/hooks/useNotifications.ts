import { useUIStore } from '../stores/uiStore'

export const useNotifications = () => {
  const notifications = useUIStore((state) => state.notifications)
  const unreadCount = useUIStore((state) => state.unreadCount)
  const markNotificationRead = useUIStore((state) => state.markNotificationRead)
  return { notifications, unreadCount, markNotificationRead }
}
