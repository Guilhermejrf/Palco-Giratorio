import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
}

export const Card = ({ children, className = '', interactive = true, ...props }: CardProps) => {
  return (
    <div className={`card ${interactive ? '' : 'hover:transform-none'} ${className}`} {...props}>
      {children}
    </div>
  )
}
