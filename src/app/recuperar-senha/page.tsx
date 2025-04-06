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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Recuperar senha
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Digite seu email para receber um link de recuperação
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="seu@email.com"
                    disabled={success}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm font-medium text-white bg-red-500 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 text-sm font-medium text-white bg-green-500 rounded-lg">
                  Um link de recuperação foi enviado para seu email, caso ele esteja cadastrado em nosso sistema.
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
            <p className="text-sm text-center text-gray-600">
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                ← Voltar para o login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 