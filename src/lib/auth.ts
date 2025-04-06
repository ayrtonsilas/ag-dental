import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const COOKIE_NAME = 'auth-token'

// User type without password
export type SafeUser = Omit<User, 'password'>

// Helper to create a safe user object (without password)
export const createSafeUser = (user: User): SafeUser => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user
  return safeUser
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export const signJWT = async (payload: Record<string, unknown>, expiresIn = JWT_EXPIRES_IN) => {
  const secret = new TextEncoder().encode(JWT_SECRET)
  
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

// Verify JWT token
export const verifyJWT = async <T>(token: string): Promise<T> => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    return payload as T
  } catch {
    throw new Error('Token inválido ou expirado')
  }
}

// Set JWT token in cookies
export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  
  return response
}

// Get JWT token from cookies
export const getAuthToken = (): string | undefined => {
  try {
    return cookies().get(COOKIE_NAME)?.value
  } catch {
    return undefined
  }
}

// Verify authentication middleware
export const validateAuth = async (): Promise<SafeUser | null> => {
  const token = getAuthToken()
  
  if (!token) {
    return null
  }
  
  try {
    const payload = await verifyJWT<{ id: string }>(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    })
    
    if (!user) {
      return null
    }
    
    return createSafeUser(user)
  } catch {
    return null
  }
}

// Remove auth cookie on logout
export const removeAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  
  return response
}

// API route auth middleware
export const withAuth = async (req: NextRequest, handler: (req: NextRequest, user: SafeUser) => Promise<NextResponse>) => {
  const user = await validateAuth()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return handler(req, user)
} 