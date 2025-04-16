import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { PatientService } from '@/services/patient.service'

// GET /api/patients - Fetch patients with pagination
export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const pageSize = parseInt(searchParams.get('pageSize') || '10')
      const search = searchParams.get('search') || ''
      
      const result = await PatientService.getPatients({
        companyId: user.companyId as string,
        page,
        pageSize,
        search
      })
      
      return NextResponse.json(result)
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
      
      const data = await req.json()
      
      const patient = await PatientService.createPatient({
        ...data,
        companyId: user.companyId
      })
      
      return NextResponse.json(patient)
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