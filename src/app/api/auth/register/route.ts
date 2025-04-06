import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { hashPassword, signJWT, setAuthCookie, createSafeUser } from '@/lib/auth'

const prisma = new PrismaClient()

// Schema validation for user registration
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  companyName: z.string().optional(),
  companyDocument: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const result = registerSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 })
    }
    
    const { name, email, password, companyName, companyDocument } = result.data
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'Este email já está em uso' }, { status: 400 })
    }
    
    // Create company if companyName is provided
    let company = null
    if (companyName && companyDocument) {
      // Check if company already exists with this document
      const existingCompany = await prisma.company.findFirst({
        where: { document: companyDocument },
      })
      
      if (existingCompany) {
        return NextResponse.json({ error: 'Esta empresa já está cadastrada' }, { status: 400 })
      }
      
      company = await prisma.company.create({
        data: {
          name: companyName,
          document: companyDocument,
        },
      })
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password)
    
    // Create the user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN', // First user is admin by default
    }
    
    if (company) {
      // @ts-ignore - Add companyId if company was created
      userData.companyId = company.id
    }
    
    const user = await prisma.user.create({
      data: userData,
    })
    
    // Generate JWT token
    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    // Create a safe user object (without password)
    const safeUser = createSafeUser(user)
    
    // Set auth cookie
    const response = NextResponse.json({ 
      user: safeUser,
      company,
      message: 'Usuário registrado com sucesso' 
    }, { status: 201 })
    
    setAuthCookie(response, token)
    
    return response
  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 