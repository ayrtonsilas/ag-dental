import { NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    // Create response with success message
    const response = NextResponse.json({ message: 'Logout realizado com sucesso' })
    
    // Remove auth cookie
    removeAuthCookie(response)
    
    return response
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 