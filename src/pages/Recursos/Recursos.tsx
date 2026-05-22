import { useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { ResourceCard } from '../../components/resources/ResourceCard/ResourceCard'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Modal } from '../../components/ui/Modal/Modal'
import { Select } from '../../components/ui/Select/Select'
import { municipalities } from '../../constants/municipalities'
import { useDemoDataStore } from '../../stores/demoDataStore'
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
  'Grupos Locais',
  'Produtores',
  'Outros',
]

export const Recursos = () => {
  const [type, setType] = useState('')
  const [availability, setAvailability] = useState('')
  const [city, setCity] = useState('')
  const [registerOpen, setRegisterOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [resourceForm, setResourceForm] = useState({
    name: '',
    type: 'Som' as ResourceType,
    city: '',
    owner: '',
    pricePerDay: '',
    availabilityText: '',
  })
  const resources = useDemoDataStore((state) => state.resources)
  const addResource = useDemoDataStore((state) => state.addResource)
  const requestResource = useDemoDataStore((state) => state.requestResource)

  const filtered = resources.filter((resource) => {
    const typeMatches = !type || resource.type === type
    const availabilityMatches = !availability || resource.availability === availability
    const cityMatches = !city || resource.city === city
    return typeMatches && availabilityMatches && cityMatches
  })

  const finishRequest = () => {
    if (selectedResource) requestResource(selectedResource.id)
    toast.success(`Solicitação enviada para ${selectedResource?.owner}.`)
    setSelectedResource(null)
  }

  const finishRegister = () => {
    addResource({
      name: resourceForm.name || 'Novo recurso da rede',
      type: resourceForm.type,
      city: resourceForm.city || 'Recife',
      owner: resourceForm.owner || 'Parceiro da rede',
      pricePerDay: Number(resourceForm.pricePerDay) || undefined,
      availabilityText: resourceForm.availabilityText,
    })
    toast.success('Recurso cadastrado na rede e disponível para análise.')
    setResourceForm({
      name: '',
      type: 'Som',
      city: '',
      owner: '',
      pricePerDay: '',
      availabilityText: '',
    })
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
            label="Município"
            options={[
              { label: 'Todos os municípios', value: '' },
              ...municipalities.map((m) => ({ label: m.name, value: m.name })),
            ]}
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <Select
            label="Tipo de recurso"
            options={types.map((item) => ({ label: item || 'Todos', value: item }))}
            value={type}
            onChange={(event) => setType(event.target.value)}
          />
          <Select
            label="Disponibilidade"
            options={[
              { label: 'Qualquer', value: '' },
              { label: 'Disponível agora', value: 'available' },
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
          {(city || type || availability) && (
            <button
              className="w-full rounded-xl py-2 text-sm font-bold text-[var(--color-warm-gray)] hover:bg-[var(--color-cream)]"
              onClick={() => { setCity(''); setType(''); setAvailability('') }}
              type="button"
            >
              Limpar filtros
            </button>
          )}
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
          <Input
            label="Nome do recurso"
            onChange={(event) => setResourceForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Ex: Kit de luz LED"
            value={resourceForm.name}
          />
          <Select
            label="Tipo"
            onChange={(event) =>
              setResourceForm((current) => ({ ...current, type: event.target.value as ResourceType }))
            }
            options={types.filter(Boolean).map((item) => ({ label: item, value: item }))}
            value={resourceForm.type}
          />
          <Input
            label="Cidade"
            onChange={(event) => setResourceForm((current) => ({ ...current, city: event.target.value }))}
            placeholder="Ex: Caruaru"
            value={resourceForm.city}
          />
          <Input
            label="Responsável"
            onChange={(event) => setResourceForm((current) => ({ ...current, owner: event.target.value }))}
            placeholder="Nome ou instituição"
            value={resourceForm.owner}
          />
          <Input
            label="Preço por dia"
            onChange={(event) => setResourceForm((current) => ({ ...current, pricePerDay: event.target.value }))}
            type="number"
            value={resourceForm.pricePerDay}
          />
          <Input
            label="Disponibilidade"
            onChange={(event) => setResourceForm((current) => ({ ...current, availabilityText: event.target.value }))}
            placeholder="Sempre disponível, por datas..."
            value={resourceForm.availabilityText}
          />
        </div>
        <Button className="mt-5" onClick={finishRegister}>
          Salvar recurso
        </Button>
      </Modal>
    </div>
  )
}
