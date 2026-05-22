import { z } from 'zod'

export const showStepOneSchema = z.object({
  name: z.string().min(3, 'Informe o nome do espetáculo'),
  synopsis: z.string().min(20, 'A sinopse precisa ter pelo menos 20 caracteres').max(300),
  minFee: z.coerce.number().positive('Informe um cachê válido'),
})

export const schoolSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  students: z.coerce.number().int().positive(),
})
