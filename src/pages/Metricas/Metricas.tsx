import { CalendarDays, GraduationCap, MapPin, Theater, Users } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { LowPulseCities } from '../../components/metrics/LowPulseCities/LowPulseCities'
import { PulseIndexCard } from '../../components/metrics/PulseIndexCard/PulseIndexCard'
import { RegionChart } from '../../components/metrics/RegionChart/RegionChart'
import { MapVivo } from '../../components/map/MapVivo/MapVivo'
import { Card } from '../../components/ui/Card/Card'
import { pulseEvolution } from '../../constants/mockData'

const periods = ['Último mês', 'Últimos 3 meses', 'Último ano']

export const Metricas = () => {
  const [period, setPeriod] = useState(periods[0])

  return (
    <div>
      <PageHeader
        title="Índice de Cena Acesa"
        subtitle={`Leituras para ${period.toLowerCase()}, por região e município.`}
        actions={
          <div className="flex flex-wrap gap-2">
            {periods.map((label) => (
              <button
                key={label}
                className={`rounded-full px-3 py-2 text-sm font-bold ${
                  period === label ? 'bg-[var(--color-primary-700)] text-white' : 'bg-white'
                }`}
                onClick={() => {
                  setPeriod(label)
                  toast.success(`Período alterado para ${label}.`)
                }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <PulseIndexCard icon={CalendarDays} label="Apresentações" value={123} />
          <PulseIndexCard icon={MapPin} label="Municípios ativos" value="67%" />
          <PulseIndexCard icon={Theater} label="Espetáculos em circulação" value={27} />
          <PulseIndexCard icon={GraduationCap} label="Escolas alcançadas" value={74} />
          <PulseIndexCard icon={Users} label="Custo por espectador" value="R$ 18,90" />
        </section>
        <section className="grid gap-6 xl:grid-cols-2">
          <Card interactive={false}>
            <h2 className="mb-4 font-display text-2xl">Apresentações por região</h2>
            <RegionChart />
          </Card>
          <Card interactive={false}>
            <h2 className="mb-4 font-display text-2xl">Intensidade cultural</h2>
            <div className="h-72 overflow-hidden rounded-2xl">
              <MapVivo compact />
            </div>
          </Card>
        </section>
        <Card interactive={false}>
          <h2 className="mb-4 font-display text-2xl">Evolução temporal</h2>
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={pulseEvolution}>
                <CartesianGrid stroke="#EDE5D8" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="Recife" stroke="#2E5F7E" strokeWidth={3} />
                <Line dataKey="Agreste" stroke="#C4755A" strokeWidth={3} />
                <Line dataKey="Sertão" stroke="#7A2E3C" strokeWidth={3} />
                <Line dataKey="Zona da Mata" stroke="#5AAEA0" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <section>
          <h2 className="mb-4 font-display text-2xl">Municípios em alerta</h2>
          <LowPulseCities />
        </section>
      </div>
    </div>
  )
}
