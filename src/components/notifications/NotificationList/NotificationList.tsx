import { useNotifications } from '../../../hooks/useNotifications'

export const NotificationList = () => {
  const { notifications } = useNotifications()
  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <article key={notification.id} className="rounded-xl bg-white p-3">
          <h3 className="text-sm font-bold">{notification.title}</h3>
          <p className="text-xs text-[var(--color-warm-gray)]">{notification.body}</p>
        </article>
      ))}
    </div>
  )
}
