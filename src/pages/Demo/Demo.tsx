import { ArrowLeft, Play, StepForward } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { municipalities } from '../../constants/municipalities'
import { Button } from '../../components/ui/Button/Button'

const narrative = [
  'Pernambuco tem 184 municípios. Muitos ainda passam meses sem circulação cultural.',
  'Um grupo de mamulengo de Arcoverde cadastra espetáculo, rider e oficina.',
  'O sistema identifica cidades interessadas na mesma semana.',
  'Em vez de uma apresentação isolada, nasce um circuito.',
  'Custo dividido. Técnico local contratado. Escola incluída na rota.',
  'O mapa acende, de Recife ao interior, e a rede ganha permanência.',
]

export const Demo = () => {
  const [step, setStep] = useState(0)
  const litCities = useMemo(() => municipalities.slice(0, Math.max(1, step * 2)), [step])

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-primary-700)] p-4 text-white md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-[52px]">Cena Acesa PE</h1>
          <p className="text-white/70">Modo pitch · municípios que acendem com circulação</p>
        </div>
        <Link to="/">
          <Button icon={<ArrowLeft className="h-4 w-4" />} variant="secondary">
            Sair do modo demo
          </Button>
        </Link>
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[560px] rounded-3xl border border-white/10 bg-white/5 p-4">
          {municipalities.map((city, index) => {
            const lit = litCities.some((item) => item.id === city.id)
            const left = ((city.coords.lng + 41) / 7) * 100
            const top = ((city.coords.lat + 10) / 3.4) * 100
            return (
              <motion.div
                key={city.id}
                animate={{
                  scale: lit ? [1, 1.4, 1] : 1,
                  opacity: lit ? 1 : 0.35,
                  backgroundColor: lit ? '#F5A87A' : '#C8C0B8',
                }}
                className="absolute grid h-5 w-5 place-items-center rounded-full shadow-lg"
                style={{ left: `${left}%`, top: `${top}%` }}
                transition={{ delay: index * 0.03, duration: 0.7 }}
                title={city.name}
              />
            )
          })}
          <div className="absolute bottom-6 left-6 max-w-md">
            <p className="font-mono text-sm text-white/60">Municípios acesos</p>
            <strong className="font-display text-[72px] leading-none">{litCities.length}</strong>
          </div>
        </div>
        <aside className="flex flex-col justify-center rounded-3xl bg-[var(--color-cream)] p-6 text-[var(--color-charcoal)]">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white p-6 shadow-soft"
          >
            <span className="font-mono text-sm text-[var(--color-secondary-300)]">Cena {step + 1}/6</span>
            <h2 className="mt-3 font-display text-3xl leading-tight">{narrative[step]}</h2>
            <p className="mt-4 text-sm text-[var(--color-warm-gray)]">
              Dados fictícios e realistas para apresentação da plataforma no ideathon.
            </p>
          </motion.div>
          <div className="mt-6 flex gap-3">
            <Button icon={<Play className="h-4 w-4" />} onClick={() => setStep(0)}>
              Iniciar demo
            </Button>
            <Button
              icon={<StepForward className="h-4 w-4" />}
              onClick={() => setStep((value) => Math.min(narrative.length - 1, value + 1))}
              variant="secondary"
            >
              Próximo
            </Button>
          </div>
        </aside>
      </section>
    </main>
  )
}
