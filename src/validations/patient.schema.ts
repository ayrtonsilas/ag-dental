import { z } from 'zod'

export const patientFormSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  phone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^[0-9()-\s]+$/, 'Telefone deve conter apenas números, parênteses, hífens e espaços'),
  documentNumber: z.string()
    .min(11, 'Documento deve ter pelo menos 11 dígitos')
    .max(14, 'Documento deve ter no máximo 14 dígitos')
    .regex(/^[0-9.-]+$/, 'Documento deve conter apenas números, pontos e hífens'),
  dateOfBirth: z.string()
    .nullable()
    .refine(val => {
      if (!val) return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Data de nascimento inválida'),
  gender: z.enum(['M', 'F', 'O'], {
    required_error: 'Gênero é obrigatório',
    invalid_type_error: 'Gênero inválido'
  }),
  address: z.string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
  healthInsurance: z.string()
    .max(100, 'Convênio deve ter no máximo 100 caracteres')
    .nullable()
    .optional(),
  healthInsuranceNumber: z.string()
    .max(20, 'Número do convênio deve ter no máximo 20 caracteres')
    .nullable()
    .optional(),
  observations: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .nullable()
    .optional(),
  isFirstVisit: z.boolean().default(false)
})

export type PatientFormSchema = z.infer<typeof patientFormSchema> 