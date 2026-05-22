type DecorativeShapeName = 'circle' | 'semicircle' | 'star' | 'flame' | 'eye'

interface DecorativeShapeProps {
  shape?: DecorativeShapeName
  color?: string
  size?: number
  className?: string
}

const starPath =
  'M103 8c9 27 25 39 54 35-21 19-25 39-10 64-24-13-44-9-62 12 4-29-6-47-31-60 28-5 43-21 49-51Z'

export const DecorativeShape = ({
  shape = 'circle',
  color = 'var(--color-primary-100)',
  size = 220,
  className = '',
}: DecorativeShapeProps) => {
  const common = { fill: color, opacity: 0.45 }
  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      width={size}
      height={size}
      viewBox="0 0 180 180"
      aria-hidden
    >
      {shape === 'circle' ? <circle cx="90" cy="90" r="78" {...common} /> : null}
      {shape === 'semicircle' ? <path d="M20 90a70 70 0 0 1 140 0v70H20Z" {...common} /> : null}
      {shape === 'star' ? <path d={starPath} {...common} /> : null}
      {shape === 'flame' ? (
        <path
          d="M92 156c36-14 52-45 38-80-8-22-27-33-26-61-25 17-55 49-54 83 1 30 15 49 42 58Z"
          {...common}
        />
      ) : null}
      {shape === 'eye' ? (
        <path
          d="M12 91s29-47 78-47 78 47 78 47-29 47-78 47S12 91 12 91Zm78 24a24 24 0 1 0 0-48 24 24 0 0 0 0 48Z"
          {...common}
        />
      ) : null}
    </svg>
  )
}
