'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  companyId?: string
}

interface Company {
  id: string
  name: string
  document: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  company: Company | null
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>
  logout: () => Promise<void>
  register: (userData: {
    name: string
    email: string
    phone: string
    password: string
    companyName?: string
    companyDocument?: string
  }) => Promise<{success: boolean, error?: string}>
  resetPassword: (email: string) => Promise<{success: boolean, error?: string}>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setCompany(data.company || null)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || 'Erro ao fazer login' 
        }
      }
      
      setUser(data.user)
      setCompany(data.company || null)
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      return { 
        success: false, 
        error: 'Ocorreu um erro ao fazer login. Tente novamente mais tarde.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      setUser(null)
      setCompany(null)
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    phone: string
    password: string
    companyName?: string
    companyDocument?: string
  }) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || 'Erro ao registrar' 
        }
      }
      
      setUser(data.user)
      if (userData.companyName && userData.companyDocument) {
        setCompany({
          id: data.user.companyId,
          name: userData.companyName,
          document: userData.companyDocument
        })
      }
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao registrar:', error)
      return { 
        success: false, 
        error: 'Ocorreu um erro ao registrar. Tente novamente mais tarde.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || 'Erro ao solicitar redefinição de senha' 
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error)
      return { 
        success: false, 
        error: 'Ocorreu um erro ao solicitar redefinição de senha. Tente novamente mais tarde.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    isAuthenticated: !!user,
    isLoading,
    user,
    company,
    login,
    logout,
    register,
    resetPassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 