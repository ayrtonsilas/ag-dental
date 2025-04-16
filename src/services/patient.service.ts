import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { PatientFormData } from '@/types'
import { patientFormSchema } from '@/validations/patient.schema'
import { z } from 'zod'

export class PatientService {
  /**
   * Get all patients with pagination and search
   */
  static async getPatients(params: {
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
        ]
      } : {})
    }
    
    // Get total count for pagination
    const total = await db.patient.count({ where })
    
    // Fetch patients
    const patients = await db.patient.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: 'asc' },
    })
    
    return {
      patients,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  /**
   * Get a single patient by ID
   */
  static async getPatientById(id: string, companyId: string) {
    const patient = await db.patient.findUnique({
      where: {
        id,
        companyId
      }
    })

    if (!patient) {
      throw new Error('Paciente não encontrado')
    }

    return patient
  }

  /**
   * Create a new patient
   */
  static async createPatient(data: PatientFormData & { companyId: string }) {
    try {
      // Validate data
      const validatedData = patientFormSchema.parse(data)
      
      const patientData = {
        ...validatedData,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        companyId: data.companyId
      }
      
      return await db.patient.create({
        data: patientData
      })
    } catch (error) {
      console.error('Error creating patient:', error)
      if (error instanceof z.ZodError) {
        throw new Error(error.errors.map((err: z.ZodIssue) => err.message).join(', '))
      }
      throw new Error('Erro ao criar paciente')
    }
  }

  /**
   * Update an existing patient
   */
  static async updatePatient(id: string, data: PatientFormData, companyId: string) {
    try {
      // Verify patient exists and belongs to company
      const existingPatient = await db.patient.findUnique({
        where: {
          id,
          companyId
        }
      })

      if (!existingPatient) {
        throw new Error('Paciente não encontrado')
      }

      // Validate data
      const validatedData = patientFormSchema.parse(data)

      const patientData = {
        ...validatedData,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
      }

      return await db.patient.update({
        where: { id },
        data: patientData
      })
    } catch (error) {
      console.error('Error updating patient:', error)
      if (error instanceof z.ZodError) {
        throw new Error(error.errors.map((err: z.ZodIssue) => err.message).join(', '))
      }
      throw new Error('Erro ao atualizar paciente')
    }
  }

  /**
   * Delete a patient
   */
  static async deletePatient(id: string, companyId: string) {
    // Verify patient exists and belongs to company
    const existingPatient = await db.patient.findUnique({
      where: {
        id,
        companyId
      }
    })

    if (!existingPatient) {
      throw new Error('Paciente não encontrado')
    }

    await db.patient.delete({
      where: { id }
    })

    return { success: true }
  }
} 