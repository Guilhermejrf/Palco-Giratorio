import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { showStepOneSchema } from '../../../utils/validators'
import { Button } from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'

type FormValues = z.infer<typeof showStepOneSchema>

export const ShowForm = () => {
  const [step, setStep] = useState(1)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(showStepOneSchema) })

  const onSubmit = () => {
    if (step < 4) setStep((value) => value + 1)
    else toast.success('Espetáculo publicado. 7 unidades compatíveis encontradas.')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
          <Input label="Nome do espetáculo" {...register('name')} error={errors.name?.message} />
          <Input label="Sinopse" {...register('synopsis')} error={errors.synopsis?.message} />
          <Input label="Cachê mínimo" type="number" {...register('minFee')} error={errors.minFee?.message} />
        </>
      ) : (
        <div className="rounded-2xl bg-[var(--color-cream)] p-5">
          <h3 className="font-display text-xl">
            {step === 2 ? 'Rider técnico' : step === 3 ? 'Disponibilidade e logística' : 'Revisão'}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-warm-gray)]">
            Este passo está preparado para receber campos específicos do backend. Na demo, avançar simula o fluxo.
          </p>
        </div>
      )}
      <Button type="submit">{step < 4 ? 'Continuar' : 'Publicar espetáculo'}</Button>
    </form>
  )
}
