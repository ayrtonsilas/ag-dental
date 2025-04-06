import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { comparePassword, signJWT, setAuthCookie, createSafeUser } from '@/lib/auth'

const prisma = new PrismaClient()

// Schema validation for login
const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const result = loginSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 })
    }
    
    const { email, password } = result.data
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }
    
    // Generate JWT token
    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    // Create a safe user object (without password)
    const safeUser = createSafeUser(user)
    
    // Set auth cookie and return user data
    const response = NextResponse.json({ 
      user: safeUser,
      company: user.company,
      message: 'Login realizado com sucesso' 
    })
    
    setAuthCookie(response, token)
    
    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 