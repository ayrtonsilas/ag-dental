import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { PatientService } from '@/services/patient.service'

interface Context {
  params: {
    id: string
  }
}

// GET /api/patients/[id] - Get a single patient
export async function GET(req: NextRequest, context: Context) {
  return withAuth(req, async (req, user) => {
    try {
      const { id } = context.params
      const patient = await PatientService.getPatientById(id, user.companyId as string)
      return NextResponse.json(patient)
    } catch (error) {
      console.error('Error fetching patient:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar paciente' },
        { status: 500 }
      )
    }
  })
}

// PUT /api/patients/[id] - Update a patient
export async function PUT(req: NextRequest, context: Context) {
  return withAuth(req, async (req, user) => {
    try {
      const { id } = context.params
      const data = await req.json()
      const updatedPatient = await PatientService.updatePatient(id, data, user.companyId as string)
      return NextResponse.json(updatedPatient)
    } catch (error) {
      console.error('Error updating patient:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar paciente' },
        { status: 500 }
      )
    }
  })
}

// DELETE /api/patients/[id] - Delete a patient
export async function DELETE(req: NextRequest, context: Context) {
  return withAuth(req, async (req, user) => {
    try {
      const { id } = context.params
      await PatientService.deletePatient(id, user.companyId as string)
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting patient:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir paciente' },
        { status: 500 }
      )
    }
  })
} 