import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: ReactNode
  isLoading?: boolean
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-secondary-300)] text-white hover:bg-[var(--color-secondary-400)]',
  secondary:
    'border border-[var(--color-secondary-300)] text-[var(--color-secondary-500)] hover:bg-[var(--color-secondary-50)]',
  ghost: 'text-[var(--color-charcoal)] hover:bg-[var(--color-cream-dark)]',
  danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
}

export const Button = ({
  children,
  variant = 'primary',
  icon,
  isLoading,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]} ${className}`}
    disabled={isLoading || props.disabled}
    {...props}
  >
    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
    {children}
  </button>
)
