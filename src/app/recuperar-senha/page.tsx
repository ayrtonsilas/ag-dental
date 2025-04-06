'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { resetPassword } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)
    
    if (!email) {
      setError('Por favor, informe seu email')
      setIsLoading(false)
      return
    }
    
    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setSuccess(true)
        setEmail('')
      } else {
        setError(result.error || 'Erro ao solicitar recuperação de senha')
      }
    } catch {
      setError('Ocorreu um erro ao solicitar recuperação de senha')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite seu email para receber um link de recuperação de senha
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                disabled={success}
              />
            </div>
          </div>

          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-2 text-sm text-green-600 bg-green-50 rounded">
              Um link de recuperação foi enviado para seu email, caso ele esteja cadastrado em nosso sistema.
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || success}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </div>
          
          <div className="flex items-center justify-center">
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 