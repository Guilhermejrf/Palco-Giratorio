import { useState } from 'react'
import toast from 'react-hot-toast'
import { Truck } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { MapVivo } from '../../components/map/MapVivo/MapVivo'
import { Button } from '../../components/ui/Button/Button'
import { Card } from '../../components/ui/Card/Card'
import { Input } from '../../components/ui/Input/Input'
import { Modal } from '../../components/ui/Modal/Modal'

const overlaps = [
  'Grupo A e Grupo B saem do Recife para o Agreste na mesma semana',
  'Mamulengo Flor do Sertão pode dividir van com oficina em Arcoverde',
  'Retorno de Petrolina coincide com carga de luz para Salgueiro',
]

export const Logistica = () => {
  const [selectedOverlap, setSelectedOverlap] = useState<string | null>(null)

  const consolidate = () => {
    toast.success('Consolidação criada e fornecedores convidados.')
    setSelectedOverlap(null)
  }

  return (
    <div>
      <PageHeader
        title="Central Logística"
        subtitle="Consolidação de cargas, rotas sobrepostas e transporte compartilhado."
        decorativeShape="semicircle"
        decorativeColor="var(--color-secondary-100)"
      />
      <div className="grid gap-6 p-4 md:p-8 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-4">
          {overlaps.map((item) => (
            <Card key={item}>
              <div className="flex gap-3">
                <Truck className="mt-1 h-5 w-5 text-[var(--color-secondary-300)]" />
                <div>
                  <h3 className="font-bold">{item}</h3>
                  <p className="text-sm text-[var(--color-warm-gray)]">Economia estimada entre 18% e 34%.</p>
                  <Button className="mt-3" onClick={() => setSelectedOverlap(item)} variant="secondary">
                    Consolidar cargas
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </section>
        <Card interactive={false}>
          <h2 className="mb-4 font-display text-2xl">Mapa de movimentação</h2>
          <div className="h-[520px] overflow-hidden rounded-2xl">
            <MapVivo />
          </div>
        </Card>
      </div>
      <Modal open={Boolean(selectedOverlap)} title="Consolidar cargas" onClose={() => setSelectedOverlap(null)}>
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--color-cream)] p-4">
            <strong>{selectedOverlap}</strong>
            <p className="text-sm text-[var(--color-warm-gray)]">
              O sistema sugere veículo único, coleta compartilhada e divisão proporcional por volume.
            </p>
          </div>
          <Input label="Veículo sugerido" defaultValue="Van de carga 8m³" />
          <Input label="Data de saída" type="date" />
          <Input label="Responsável pela consolidação" defaultValue="Central Logística Sesc PE" />
          <Button onClick={consolidate}>Confirmar consolidação</Button>
        </div>
      </Modal>
    </div>
  )
}
