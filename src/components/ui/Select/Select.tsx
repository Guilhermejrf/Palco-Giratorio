import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ label: string; value: string }>
}

export const Select = ({ label, options, id, className = '', ...props }: SelectProps) => {
  const selectId = id ?? props.name
  return (
    <label className="block text-sm font-semibold text-[var(--color-charcoal)]" htmlFor={selectId}>
      {label}
      <select
        id={selectId}
        className={`mt-1 w-full rounded-lg border border-[var(--color-cream-dark)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-300)] ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
