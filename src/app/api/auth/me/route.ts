import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthToken, validateAuth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Verify auth token
    const user = await validateAuth()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    
    // Get company information if the user belongs to one
    let company = null
    if (user.companyId) {
      company = await prisma.company.findUnique({
        where: { id: user.companyId },
      })
    }
    
    return NextResponse.json({ 
      user,
      company
    })
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 