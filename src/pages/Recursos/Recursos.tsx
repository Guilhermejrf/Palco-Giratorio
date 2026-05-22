import { useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { ResourceCard } from '../../components/resources/ResourceCard/ResourceCard'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Modal } from '../../components/ui/Modal/Modal'
import { Select } from '../../components/ui/Select/Select'
import { resources } from '../../constants/mockData'
import type { Resource, ResourceType } from '../../types/resource.types'

const types: Array<ResourceType | ''> = [
  '',
  'Som',
  'Luz',
  'Palco',
  'Transporte',
  'Hospedagem',
  'Técnicos',
  'Espaços',
  'Outros',
]

export const Recursos = () => {
  const [type, setType] = useState('')
  const [availability, setAvailability] = useState('')
  const [registerOpen, setRegisterOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  const filtered = resources.filter((resource) => {
    const typeMatches = !type || resource.type === type
    const availabilityMatches = !availability || resource.availability === availability
    return typeMatches && availabilityMatches
  })

  const finishRequest = () => {
    toast.success(`Solicitação enviada para ${selectedResource?.owner}.`)
    setSelectedResource(null)
  }

  const finishRegister = () => {
    toast.success('Recurso cadastrado na rede e disponível para análise.')
    setRegisterOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Banco de Recursos"
        subtitle="Equipamentos, técnicos, transporte e hospedagem compartilhados pela rede."
        actions={<Button onClick={() => setRegisterOpen(true)}>Cadastrar recurso</Button>}
      />
      <div className="grid gap-6 p-4 md:grid-cols-[260px_1fr] md:p-8">
        <aside className="space-y-4 rounded-2xl bg-white p-4">
          <Select
            label="Tipo"
            options={types.map((item) => ({ label: item || 'Todos', value: item }))}
            value={type}
            onChange={(event) => setType(event.target.value)}
          />
          <Select
            label="Disponibilidade"
            options={[
              { label: 'Qualquer', value: '' },
              { label: 'Disponível', value: 'available' },
              { label: 'Por agendamento', value: 'by_schedule' },
              { label: 'Ocupado', value: 'busy' },
            ]}
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
          />
          <label className="block text-sm font-semibold">
            Raio de distância
            <input className="mt-3 w-full accent-[var(--color-secondary-300)]" max="200" min="0" type="range" />
          </label>
        </aside>
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onRequest={setSelectedResource} />
          ))}
        </section>
      </div>

      <Modal
        open={Boolean(selectedResource)}
        title={`Solicitar ${selectedResource?.name ?? 'recurso'}`}
        onClose={() => setSelectedResource(null)}
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-warm-gray)]">
            O responsável receberá sua solicitação com datas, circuito associado e observações de logística.
          </p>
          <Input label="Data de uso" type="date" />
          <Input label="Circuito ou atividade" placeholder="Ex: Circuito Bonecos Acesos" />
          <Input label="Observações" placeholder="Horário, montagem, retirada e contato local" />
          <div className="rounded-2xl bg-[var(--color-cream)] p-4 text-sm">
            <strong>{selectedResource?.owner}</strong>
            <p className="text-[var(--color-warm-gray)]">
              {selectedResource?.city} · {selectedResource?.networkShared ? 'Cedido pela rede' : 'Contratação paga'}
            </p>
          </div>
          <Button className="w-full" onClick={finishRequest}>
            Enviar solicitação
          </Button>
        </div>
      </Modal>

      <Modal open={registerOpen} title="Cadastrar recurso" onClose={() => setRegisterOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nome do recurso" placeholder="Ex: Kit de luz LED" />
          <Select label="Tipo" options={types.filter(Boolean).map((item) => ({ label: item, value: item }))} />
          <Input label="Cidade" placeholder="Ex: Caruaru" />
          <Input label="Responsável" placeholder="Nome ou instituição" />
          <Input label="Preço por dia" type="number" />
          <Input label="Disponibilidade" placeholder="Sempre disponível, por datas..." />
        </div>
        <Button className="mt-5" onClick={finishRegister}>
          Salvar recurso
        </Button>
      </Modal>
    </div>
  )
}
