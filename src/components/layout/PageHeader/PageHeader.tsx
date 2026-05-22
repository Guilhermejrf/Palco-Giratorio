import type { ReactNode } from 'react'
import { DecorativeShape } from '../../ui/DecorativeShape/DecorativeShape'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: string[]
  actions?: ReactNode
  decorativeShape?: 'circle' | 'star' | 'semicircle'
  decorativeColor?: string
}

export const PageHeader = ({
  title,
  subtitle,
  breadcrumb,
  actions,
  decorativeShape = 'circle',
  decorativeColor = 'var(--color-primary-100)',
}: PageHeaderProps) => (
  <section className="relative overflow-hidden rounded-b-3xl px-4 py-8 md:px-8">
    <DecorativeShape
      shape={decorativeShape}
      color={decorativeColor}
      size={240}
      className="-right-12 -top-20"
    />
    <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        {breadcrumb ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-warm-gray)]">
            {breadcrumb.join(' / ')}
          </p>
        ) : null}
        <h1 className="font-display text-3xl leading-tight md:text-[36px]">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-3xl text-md text-[var(--color-warm-gray)]">{subtitle}</p> : null}
      </div>
      {actions ? <div className="relative z-10 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  </section>
)
