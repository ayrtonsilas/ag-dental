'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyDocument, setCompanyDocument] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  const { register } = useAuth()
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    if (step === 1) {
      // Validate first step
      if (!name || !email || !password) {
        setError('Preencha todos os campos obrigatórios')
        setIsLoading(false)
        return
      }
      
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        setIsLoading(false)
        return
      }
      
      setStep(2)
      setIsLoading(false)
      return
    }
    
    try {
      // Both steps are now complete
      const result = await register({
        name,
        email,
        password,
        companyName: companyName || undefined,
        companyDocument: companyDocument || undefined
      })
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error || 'Erro ao registrar')
      }
    } catch {
      setError('Ocorreu um erro ao registrar')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Crie sua conta' : 'Informações da Empresa'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 
              ? 'Informe seus dados para criar sua conta' 
              : 'Opcional: Adicione informações da sua empresa'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">Nome</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Nome completo"
                />
              </div>
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Senha"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="companyName" className="sr-only">Nome da Empresa</label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  autoComplete="organization"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Nome da Empresa (opcional)"
                />
              </div>
              <div>
                <label htmlFor="companyDocument" className="sr-only">CNPJ</label>
                <input
                  id="companyDocument"
                  name="companyDocument"
                  type="text"
                  value={companyDocument}
                  onChange={e => setCompanyDocument(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="CNPJ (opcional)"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Voltar
              </button>
            )}
            <div className={step === 1 ? 'w-full' : ''}>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? 'Processando...' 
                  : step === 1 
                    ? 'Próximo' 
                    : 'Criar Conta'
                }
              </button>
            </div>
          </div>
          
          <div className="text-center text-sm">
            <span>Já tem uma conta?</span>{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 