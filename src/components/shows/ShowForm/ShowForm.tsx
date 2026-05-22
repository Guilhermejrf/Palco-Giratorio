import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import { Button } from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { Select } from '../../ui/Select/Select'

interface ShowFormProps {
  onCreated?: () => void
}

const languageOptions = ['Teatro', 'Dança', 'Circo', 'Mamulengo', 'Música', 'Cultura Popular']

export const ShowForm = ({ onCreated }: ShowFormProps) => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    synopsis: '',
    minFee: '',
    group: '',
    originCity: '',
    language: 'Teatro',
    durationMinutes: '50',
    minAge: '10',
    hasWorkshop: false,
    workshopDescription: '',
    stageWidth: '6',
    stageDepth: '4',
    sound: 'PA médio, 4 canais',
    light: '12 refletores LED',
    powerKw: '6',
    generator: false,
    cargoKg: '120',
    cargoM3: '1.8',
    setupHours: '2',
    technicians: '1',
  })
  const addShow = useDemoDataStore((state) => state.addShow)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (step === 1 && (!form.name || !form.synopsis || !Number(form.minFee))) {
      toast.error('Preencha nome, sinopse e cachê mínimo para continuar.')
      return
    }

    if (step < 4) {
      setStep((value) => value + 1)
      return
    }

    addShow({
      name: form.name,
      synopsis: form.synopsis,
      minFee: Number(form.minFee),
    })
    toast.success('Espetáculo publicado. 7 unidades compatíveis encontradas.')
    onCreated?.()
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={`h-2 flex-1 rounded-full ${item <= step ? 'bg-[var(--color-secondary-300)]' : 'bg-[var(--color-cream-dark)]'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nome do espetáculo"
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              value={form.name}
              placeholder="Ex: A Peleja do Riso"
            />
            <Input
              label="Grupo ou companhia"
              onChange={(event) => setForm((current) => ({ ...current, group: event.target.value }))}
              value={form.group}
              placeholder="Ex: Mamulengo Flor do Sertão"
            />
            <Input
              label="Cidade de origem"
              onChange={(event) => setForm((current) => ({ ...current, originCity: event.target.value }))}
              value={form.originCity}
              placeholder="Ex: Caruaru"
            />
            <Select
              label="Linguagem artística"
              options={languageOptions.map((l) => ({ label: l, value: l }))}
              value={form.language}
              onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
            />
            <Input
              label="Duração (minutos)"
              type="number"
              onChange={(event) => setForm((current) => ({ ...current, durationMinutes: event.target.value }))}
              value={form.durationMinutes}
            />
            <Input
              label="Idade mínima"
              type="number"
              onChange={(event) => setForm((current) => ({ ...current, minAge: event.target.value }))}
              value={form.minAge}
            />
          </div>
          <Input
            label="Sinopse"
            onChange={(event) => setForm((current) => ({ ...current, synopsis: event.target.value }))}
            value={form.synopsis}
            placeholder="Breve descrição do espetáculo..."
          />
          <Input
            label="Cachê mínimo (R$)"
            onChange={(event) => setForm((current) => ({ ...current, minFee: event.target.value }))}
            type="number"
            value={form.minFee}
          />
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-sm font-semibold text-[var(--color-warm-gray)]">Rider técnico do espetáculo</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Largura do palco (metros)"
              type="number"
              value={form.stageWidth}
              onChange={(e) => setForm((f) => ({ ...f, stageWidth: e.target.value }))}
            />
            <Input
              label="Profundidade do palco (metros)"
              type="number"
              value={form.stageDepth}
              onChange={(e) => setForm((f) => ({ ...f, stageDepth: e.target.value }))}
            />
            <Input
              label="Sistema de som necessário"
              value={form.sound}
              onChange={(e) => setForm((f) => ({ ...f, sound: e.target.value }))}
              placeholder="Ex: PA médio, 4 canais..."
            />
            <Input
              label="Iluminação necessária"
              value={form.light}
              onChange={(e) => setForm((f) => ({ ...f, light: e.target.value }))}
              placeholder="Ex: 12 refletores LED..."
            />
            <Input
              label="Demanda de energia (kW)"
              type="number"
              value={form.powerKw}
              onChange={(e) => setForm((f) => ({ ...f, powerKw: e.target.value }))}
            />
            <Input
              label="Técnicos da equipe"
              type="number"
              value={form.technicians}
              onChange={(e) => setForm((f) => ({ ...f, technicians: e.target.value }))}
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p className="text-sm font-semibold text-[var(--color-warm-gray)]">Logística e disponibilidade</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Peso da carga (kg)"
              type="number"
              value={form.cargoKg}
              onChange={(e) => setForm((f) => ({ ...f, cargoKg: e.target.value }))}
            />
            <Input
              label="Volume da carga (m³)"
              type="number"
              value={form.cargoM3}
              onChange={(e) => setForm((f) => ({ ...f, cargoM3: e.target.value }))}
            />
            <Input
              label="Tempo de montagem (horas)"
              type="number"
              value={form.setupHours}
              onChange={(e) => setForm((f) => ({ ...f, setupHours: e.target.value }))}
            />
            <label className="flex items-center gap-3 rounded-2xl bg-[var(--color-cream)] p-4">
              <input
                type="checkbox"
                checked={form.generator}
                onChange={(e) => setForm((f) => ({ ...f, generator: e.target.checked }))}
                className="accent-[var(--color-secondary-300)]"
              />
              <span className="text-sm font-semibold">Requer gerador próprio</span>
            </label>
          </div>
          <label className="flex items-center gap-3 rounded-2xl bg-[var(--color-cream)] p-4">
            <input
              type="checkbox"
              checked={form.hasWorkshop}
              onChange={(e) => setForm((f) => ({ ...f, hasWorkshop: e.target.checked }))}
              className="accent-[var(--color-secondary-300)]"
            />
            <span className="text-sm font-semibold">Oferece oficina / ação formativa</span>
          </label>
          {form.hasWorkshop && (
            <Input
              label="Descrição da oficina"
              value={form.workshopDescription}
              onChange={(e) => setForm((f) => ({ ...f, workshopDescription: e.target.value }))}
              placeholder="Descreva a atividade formativa..."
            />
          )}
        </>
      )}

      {step === 4 && (
        <div className="space-y-4 rounded-2xl bg-[var(--color-cream)] p-5">
          <h3 className="font-display text-xl">Revisão antes de publicar</h3>
          <div className="grid gap-2 text-sm">
            <p><strong>Espetáculo:</strong> {form.name || '—'}</p>
            <p><strong>Grupo:</strong> {form.group || '—'}</p>
            <p><strong>Linguagem:</strong> {form.language}</p>
            <p><strong>Cachê mínimo:</strong> R$ {form.minFee || '0'}</p>
            <p><strong>Palco:</strong> {form.stageWidth}m × {form.stageDepth}m</p>
            <p><strong>Carga:</strong> {form.cargoKg}kg · {form.cargoM3}m³</p>
            <p><strong>Equipe:</strong> {form.technicians} técnico{Number(form.technicians) !== 1 ? 's' : ''}</p>
          </div>
          <p className="text-sm text-[var(--color-warm-gray)]">
            Ao publicar, o sistema cruzará o rider com espaços disponíveis e identificará unidades compatíveis.
          </p>
        </div>
      )}

      <Button type="submit">{step < 4 ? 'Continuar' : 'Publicar espetáculo'}</Button>
    </form>
  )
}
