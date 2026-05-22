import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${value}%`

export const formatDate = (date: string) => format(parseISO(date), "dd 'de' MMM", { locale: ptBR })
