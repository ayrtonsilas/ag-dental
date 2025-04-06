'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { LoadingIndicator } from '@/components/LoadingIndicator'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword, isLoading: authLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setMessage(null)
    setIsLoading(true)
    
    try {
      const trimmedEmail = email.trim()
      
      // Basic validation
      if (!trimmedEmail) {
        setMessage({ text: 'Por favor, informe seu email', isError: true })
        setIsLoading(false)
        return
      }

      const result = await resetPassword(trimmedEmail)
      
      if (result.success) {
        setMessage({ 
          text: 'Enviamos instruções para recuperação de senha no seu email.', 
          isError: false 
        })
        setEmail('')
      } else {
        setMessage({ text: result.error || 'Falha ao processar solicitação', isError: true })
      }
    } catch {
      setMessage({ 
        text: 'Erro ao solicitar recuperação de senha. Tente novamente.', 
        isError: true 
      })
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
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">Recuperar Senha</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite seu email para receber as instruções de recuperação de senha
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className={`px-4 py-3 rounded relative ${
              message.isError 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {message.text}
            </div>
          )}
          
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
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Enviar instruções de recuperação'}
            </button>
          </div>
          
          <div className="text-center">
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 