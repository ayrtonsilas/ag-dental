import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { ProfessionalFormData } from '@/types'
import { professionalFormSchema } from '@/validations/professional.schema'
import { z } from 'zod'

export class ProfessionalService {
  /**
   * Get all professionals with pagination and search
   */
  static async getProfessionals(params: {
    companyId: string
    page?: number
    pageSize?: number
    search?: string
  }) {
    const { companyId, page = 1, pageSize = 10, search = '' } = params
    
    // Calculate pagination values
    const skip = (page - 1) * pageSize
    
    // Query with filters and company restriction
    const where = {
      companyId,
      ...(search ? {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { documentNumber: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { specialty: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ]
      } : {})
    }
    
    // Get total count for pagination
    const total = await db.professional.count({ where })
    
    // Fetch professionals
    const professionals = await db.professional.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: 'asc' },
    })
    
    return {
      professionals,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  /**
   * Get a single professional by ID
   */
  static async getProfessionalById(id: string, companyId: string) {
    const professional = await db.professional.findUnique({
      where: {
        id,
        companyId
      }
    })

    if (!professional) {
      throw new Error('Profissional não encontrado')
    }

    return professional
  }

  /**
   * Create a new professional
   */
  static async createProfessional(data: ProfessionalFormData & { companyId: string }) {
    try {
      // Validate data
      const validatedData = professionalFormSchema.parse(data)
      
      const professionalData = {
        ...validatedData,
        companyId: data.companyId,
        userId: data.userId
      }
      
      return await db.professional.create({
        data: professionalData
      })
    } catch (error) {
      console.error('Error creating professional:', error)
      if (error instanceof z.ZodError) {
        throw new Error(error.errors.map((err: z.ZodIssue) => err.message).join(', '))
      }
      throw new Error('Erro ao criar profissional')
    }
  }

  /**
   * Update an existing professional
   */
  static async updateProfessional(id: string, data: ProfessionalFormData, companyId: string) {
    try {
      // Verify professional exists and belongs to company
      const existingProfessional = await db.professional.findUnique({
        where: {
          id,
          companyId
        }
      })

      if (!existingProfessional) {
        throw new Error('Profissional não encontrado')
      }

      // Validate data
      const validatedData = professionalFormSchema.parse(data)

      return await db.professional.update({
        where: { id },
        data: validatedData
      })
    } catch (error) {
      console.error('Error updating professional:', error)
      if (error instanceof z.ZodError) {
        throw new Error(error.errors.map((err: z.ZodIssue) => err.message).join(', '))
      }
      throw new Error('Erro ao atualizar profissional')
    }
  }

  /**
   * Delete a professional
   */
  static async deleteProfessional(id: string, companyId: string) {
    // Verify professional exists and belongs to company
    const existingProfessional = await db.professional.findUnique({
      where: {
        id,
        companyId
      }
    })

    if (!existingProfessional) {
      throw new Error('Profissional não encontrado')
    }

    await db.professional.delete({
      where: { id }
    })

    return { success: true }
  }
} 