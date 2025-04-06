import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/auth'

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

      const patient = await db.patient.findUnique({
        where: {
          id,
          companyId: user.companyId as string
        }
      })

      if (!patient) {
        return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
      }

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

      // Verify patient exists and belongs to user's company
      const existingPatient = await db.patient.findUnique({
        where: {
          id,
          companyId: user.companyId as string
        }
      })

      if (!existingPatient) {
        return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
      }

      // Update patient
      const updatedPatient = await db.patient.update({
        where: { id },
        data
      })

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

      // Verify patient exists and belongs to user's company
      const existingPatient = await db.patient.findUnique({
        where: {
          id,
          companyId: user.companyId as string
        }
      })

      if (!existingPatient) {
        return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
      }

      // Delete patient
      await db.patient.delete({
        where: { id }
      })

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