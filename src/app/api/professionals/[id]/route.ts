import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/auth'

interface Context {
  params: {
    id: string
  }
}

// GET /api/professionals/[id] - Get a single professional
export async function GET(req: NextRequest, context: Context) {
  return withAuth(req, async (req, user) => {
    try {
      const { id } = context.params

      const professional = await db.professional.findUnique({
        where: {
          id,
          companyId: user.companyId as string
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      })

      if (!professional) {
        return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 })
      }

      return NextResponse.json(professional)
    } catch (error) {
      console.error('Error fetching professional:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar profissional' },
        { status: 500 }
      )
    }
  })
}

// PUT /api/professionals/[id] - Update a professional
export async function PUT(req: NextRequest, context: Context) {
  return withAuth(req, async (req, user) => {
    try {
      const { id } = context.params
      const data = await req.json()
      const { password, role, ...professionalData } = data

      // Verify professional exists and belongs to user's company
      const existingProfessional = await db.professional.findUnique({
        where: {
          id,
          companyId: user.companyId as string
        },
        include: {
          user: true
        }
      })

      if (!existingProfessional) {
        return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 })
      }

      // Update user and professional in transaction
      const updatedProfessional = await db.$transaction(async (tx) => {
        // Update user if needed
        if (role || password) {
          await tx.user.update({
            where: { id: existingProfessional.userId },
            data: {
              ...(role ? { role } : {}),
              ...(password ? { password } : {})
            }
          })
        }
        
        // Update professional
        return tx.professional.update({
          where: { id },
          data: professionalData,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        })
      })

      return NextResponse.json(updatedProfessional)
    } catch (error) {
      console.error('Error updating professional:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar profissional' },
        { status: 500 }
      )
    }
  })
}

// DELETE /api/professionals/[id] - Delete a professional
export async function DELETE(req: NextRequest, context: Context) {
  return withAuth(req, async (req, user) => {
    try {
      const { id } = context.params

      // Verify professional exists and belongs to user's company
      const existingProfessional = await db.professional.findUnique({
        where: {
          id,
          companyId: user.companyId as string
        },
        include: {
          user: true
        }
      })

      if (!existingProfessional) {
        return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 })
      }

      // Delete professional and associated user
      await db.$transaction(async (tx) => {
        // Delete professional first due to foreign key constraint
        await tx.professional.delete({
          where: { id }
        })
        
        // Delete associated user
        await tx.user.delete({
          where: { id: existingProfessional.userId }
        })
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting professional:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir profissional' },
        { status: 500 }
      )
    }
  })
} 