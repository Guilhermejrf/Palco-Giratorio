export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
}

export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
}

export const pulseAnimation = {
  scale: [1, 1.3, 1],
  opacity: [0.7, 1, 0.7],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
}
