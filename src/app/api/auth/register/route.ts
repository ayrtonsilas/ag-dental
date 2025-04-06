import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient, Role, Prisma } from '@prisma/client'
import { hashPassword, signJWT, setAuthCookie, createSafeUser } from '@/lib/auth'

const prisma = new PrismaClient()

// Schema validation for user registration
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  companyName: z.string().min(2, { message: 'Nome da empresa deve ter pelo menos 2 caracteres' }),
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
    
    const { name, email, phone, password, companyName, companyDocument } = result.data
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'Este email já está em uso' }, { status: 400 })
    }
    
    // Check if company with same CNPJ already exists
    if (companyDocument && companyDocument.trim() !== '') {
      const existingCompany = await prisma.company.findUnique({
        where: { document: companyDocument },
      })
      
      if (existingCompany) {
        return NextResponse.json({ 
          error: 'Já existe uma empresa cadastrada com este CNPJ' 
        }, { status: 400 })
      }
    }
    
    // Create company if companyName is provided
    let company = null
    if (companyName) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          document: companyDocument || '',
        },
      })
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password)
    
    // Create the user
    const userData: {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: Role;
      companyId?: string;
    } = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'ADMIN' as Role, // First user is admin by default
    }
    
    if (company) {
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
    
    // Check for Prisma unique constraint error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Check if the error is related to the unique constraint on "document" field
        const target = error.meta?.target as string[] | undefined
        if (target && target.includes('document')) {
          return NextResponse.json({ 
            error: 'Já existe uma empresa cadastrada com este CNPJ' 
          }, { status: 400 })
        }
      }
    }
    
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 