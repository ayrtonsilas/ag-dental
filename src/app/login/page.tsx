'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { LoadingIndicator } from '@/components/LoadingIndicator'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, isLoading: authLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setErrorMessage(null)
    setIsLoading(true)
    
    try {
      const trimmedEmail = email.trim()
      const trimmedPassword = password.trim()
      
      // Basic validation
      if (!trimmedEmail || !trimmedPassword) {
        setErrorMessage('Por favor, preencha todos os campos')
        setIsLoading(false)
        return
      }

      const result = await login(trimmedEmail, trimmedPassword)
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setErrorMessage(result.error || 'Falha na autenticação')
      }
    } catch {
      setErrorMessage('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return <LoadingIndicator fullScreen />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-center text-3xl font-bold text-blue-600">Sistema Odontológico</h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">Login</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {errorMessage}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mb-4"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Sua senha"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/recuperar-senha" className="font-medium text-blue-600 hover:text-blue-500">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          <div className="text-center">
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
              Não tem conta? Registre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 