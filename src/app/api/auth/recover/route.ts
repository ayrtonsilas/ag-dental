import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

// Schema validation for recovery request
const recoverRequestSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
})

// Schema validation for password reset
const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token é obrigatório' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
})

// Request recovery email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const result = recoverRequestSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 })
    }
    
    const { email } = result.data
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })
    
    if (!user) {
      // Don't reveal that the email doesn't exist for security reasons
      return NextResponse.json({ 
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.' 
      })
    }
    
    // In a real application, you would:
    // 1. Generate a secure random token
    // 2. Store it in the database with expiration
    // 3. Send a recovery email with a link containing the token
    
    // For demonstration purposes, we'll just return a success message
    return NextResponse.json({ 
      message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.' 
    })
  } catch (error) {
    console.error('Erro na solicitação de recuperação:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Reset password with token
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const result = resetPasswordSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 })
    }
    
    const { token, password } = result.data
    
    // In a real application, you would:
    // 1. Validate the token from the database
    // 2. Check if it's expired
    // 3. Find the associated user
    
    // For demonstration purposes, we'll simulate a failure
    // In a real application, you would look up the token and find the user
    
    // Mock: Find user by token (in a real app, you'd have a tokens table)
    const userId = 'mock-user-id'
    
    // Hash the new password
    const hashedPassword = await hashPassword(password)
    
    // Update the user's password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })
    
    return NextResponse.json({ 
      message: 'Senha redefinida com sucesso.' 
    })
  } catch (error) {
    console.error('Erro na redefinição de senha:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 