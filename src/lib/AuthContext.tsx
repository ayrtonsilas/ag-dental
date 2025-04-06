'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>
  logout: () => Promise<void>
  register: (userData: any) => Promise<{success: boolean, error?: string}>
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
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would check a token in localStorage and validate it
        const savedUser = localStorage.getItem('dental_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        // If there's an error, clear any corrupted state
        localStorage.removeItem('dental_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // This is a mock implementation - would be replaced with actual API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login (would be replaced with actual API validation)
      if (email === 'admin@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Administrador',
          email: 'admin@example.com',
          role: 'admin'
        }
        
        localStorage.setItem('dental_user', JSON.stringify(userData))
        setUser(userData)
        return { success: true }
      }
      
      return { 
        success: false, 
        error: 'Email ou senha inválidos. Tente novamente.' 
      }
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
      // Would make an API call to invalidate tokens in a real app
      localStorage.removeItem('dental_user')
      setUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      
      // This is a mock implementation - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful registration
      const newUser = {
        id: Date.now().toString(),
        ...userData
      }
      
      localStorage.setItem('dental_user', JSON.stringify(newUser))
      setUser(newUser)
      
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
      
      // This is a mock implementation - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful password reset request
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
    login,
    logout,
    register,
    resetPassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 