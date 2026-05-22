export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`shimmer rounded-lg ${className}`} aria-hidden />
)
