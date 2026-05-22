import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

export const Modal = ({ title, open, onClose, children }: ModalProps) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-end bg-black/35 p-0 md:items-center md:justify-center md:p-6">
      <section className="max-h-[92vh] w-full overflow-auto rounded-t-2xl bg-white p-5 shadow-2xl md:max-w-3xl md:rounded-2xl">
        <header className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-xl">{title}</h2>
          <button
            aria-label="Fechar modal"
            className="rounded-full p-2 hover:bg-[var(--color-cream)]"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}
