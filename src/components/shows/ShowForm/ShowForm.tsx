import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import { Button } from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'

interface ShowFormProps {
  onCreated?: () => void
}

export const ShowForm = ({ onCreated }: ShowFormProps) => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', synopsis: '', minFee: '' })
  const addShow = useDemoDataStore((state) => state.addShow)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (step === 1 && (!form.name || !form.synopsis || !Number(form.minFee))) {
      toast.error('Preencha nome, sinopse e cache minimo para continuar.')
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
    toast.success('Espetaculo publicado. 7 unidades compativeis encontradas.')
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
      {step === 1 ? (
        <>
          <Input
            label="Nome do espetaculo"
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            value={form.name}
          />
          <Input
            label="Sinopse"
            onChange={(event) => setForm((current) => ({ ...current, synopsis: event.target.value }))}
            value={form.synopsis}
          />
          <Input
            label="Cache minimo"
            onChange={(event) => setForm((current) => ({ ...current, minFee: event.target.value }))}
            type="number"
            value={form.minFee}
          />
        </>
      ) : (
        <div className="rounded-2xl bg-[var(--color-cream)] p-5">
          <h3 className="font-display text-xl">
            {step === 2 ? 'Rider tecnico' : step === 3 ? 'Disponibilidade e logistica' : 'Revisao'}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-warm-gray)]">
            Este passo esta preparado para receber campos especificos do backend. Na demo, avancar simula o fluxo.
          </p>
        </div>
      )}
      <Button type="submit">{step < 4 ? 'Continuar' : 'Publicar espetaculo'}</Button>
    </form>
  )
}
