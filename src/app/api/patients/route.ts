import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/auth'
import { Prisma } from '@prisma/client'

// GET /api/patients - Fetch patients with pagination
export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const pageSize = parseInt(searchParams.get('pageSize') || '10')
      const search = searchParams.get('search') || ''
      
      // Calculate pagination values
      const skip = (page - 1) * pageSize
      
      // Query with filters and company restriction
      const where = {
        companyId: user.companyId as string,
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
      
      return NextResponse.json({
        patients,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      })
    } catch (error) {
      console.error('Error fetching patients:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar pacientes' },
        { status: 500 }
      )
    }
  })
}

// POST /api/patients - Create a new patient
export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      if (!user.companyId) {
        return NextResponse.json(
          { error: 'Usuário deve estar associado a uma empresa' },
          { status: 400 }
        )
      }
      
      // Parse the request body
      const data = await req.json()
      console.log('Patient data received:', JSON.stringify(data, null, 2))
      
      // Simplify dateOfBirth handling
      const patientData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        companyId: user.companyId
      }
      
      // Create patient
      try {
        const patient = await db.patient.create({
          data: patientData
        })
        
        return NextResponse.json(patient)
      } catch (dbError) {
        console.error('Database error creating patient:', dbError)
        return NextResponse.json(
          { 
            error: 'Erro de banco de dados ao criar paciente',
            details: dbError instanceof Error ? dbError.message : String(dbError)
          },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('Error processing patient create request:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao processar solicitação de paciente',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      )
    }
  })
} 