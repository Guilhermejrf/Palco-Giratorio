import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, error, id, className = '', ...props }: InputProps) => {
  const inputId = id ?? props.name
  return (
    <label className="block text-sm font-semibold text-[var(--color-charcoal)]" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={`mt-1 w-full rounded-lg border border-[var(--color-cream-dark)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary-300)] focus:ring-2 focus:ring-[var(--color-primary-100)] ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="mt-1 block text-xs text-[var(--color-danger)]">
          {error}
        </span>
      ) : null}
    </label>
  )
}
