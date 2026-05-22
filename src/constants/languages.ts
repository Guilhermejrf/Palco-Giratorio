import type { ArtisticLanguage } from '../types/show.types'

export const LANGUAGES: ArtisticLanguage[] = [
  'Teatro',
  'Dança',
  'Circo',
  'Mamulengo',
  'Música',
  'Cultura Popular',
]

export const LANGUAGE_BADGE_CLASS: Record<ArtisticLanguage, string> = {
  Teatro: 'bg-[var(--color-accent-200)] text-[var(--color-charcoal)]',
  Dança: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
  Circo: 'bg-[#FAD4A0] text-[var(--color-charcoal)]',
  Mamulengo: 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-600)]',
  Música: 'bg-[var(--color-blue-100)] text-[var(--color-blue-600)]',
  'Cultura Popular': 'bg-[#C8DBC8] text-[var(--color-primary-700)]',
}
