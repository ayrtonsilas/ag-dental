import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/auth'
import { hashPassword } from '@/lib/auth'
import { Prisma } from '@prisma/client'

// GET /api/professionals - Fetch professionals with pagination
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
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          }
        }
      })
      
      return NextResponse.json({
        professionals,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      })
    } catch (error) {
      console.error('Error fetching professionals:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar profissionais' },
        { status: 500 }
      )
    }
  })
}

// POST /api/professionals - Create a new professional with user account
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
      const { password, role, ...professionalData } = data
      
      // Create user first
      const hashedPassword = await hashPassword(password || 'temp123456')
      
      // Create professional with user
      const professional = await db.$transaction(async tx => {
        // Create user
        const newUser = await tx.user.create({
          data: {
            name: professionalData.name,
            email: professionalData.email,
            password: hashedPassword,
            role: role || 'USER',
            companyId: user.companyId,
          }
        })
        
        // Create professional linked to user
        return tx.professional.create({
          data: {
            ...professionalData,
            companyId: user.companyId,
            userId: newUser.id
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
      })
      
      return NextResponse.json(professional)
    } catch (error) {
      console.error('Error creating professional:', error)
      return NextResponse.json(
        { error: 'Erro ao criar profissional' },
        { status: 500 }
      )
    }
  })
} 