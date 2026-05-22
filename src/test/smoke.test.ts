import { describe, expect, it } from 'vitest'
import { cityStatusColor, pulseLabel } from '../utils/colorUtils'
import { formatCurrency } from '../utils/formatters'

describe('Acende PE smoke checks', () => {
  it('formats Brazilian currency', () => {
    expect(formatCurrency(1890)).toContain('R$')
    expect(formatCurrency(1890)).toContain('1.890')
  })

  it('maps city pulse status to visual language', () => {
    expect(cityStatusColor('pulse')).toBe('var(--color-city-pulse)')
    expect(pulseLabel('off')).toBe('Sem circulação')
  })
})
