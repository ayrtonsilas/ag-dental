import { z } from 'zod'

export const professionalFormSchema = z.object({
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
  specialty: z.string()
    .min(3, 'Especialidade deve ter pelo menos 3 caracteres')
    .max(100, 'Especialidade deve ter no máximo 100 caracteres'),
  registrationNumber: z.string()
    .min(5, 'Número de registro deve ter pelo menos 5 caracteres')
    .max(20, 'Número de registro deve ter no máximo 20 caracteres'),
  isActive: z.boolean().default(true),
  userId: z.string().min(1, 'ID do usuário é obrigatório')
})

export type ProfessionalFormSchema = z.infer<typeof professionalFormSchema> 