'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { formatPhone, formatCNPJ, unformatValue } from '@/lib/masks'
import { LoadingIndicator } from '@/components/LoadingIndicator'

type UserFormData = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

type CompanyFormData = {
  companyName: string
  companyCnpj: string
  companyPhone: string
  companyAddress: string
}

export default function RegisterPage() {
  const initialUserFormData: UserFormData = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }

  const initialCompanyFormData: CompanyFormData = {
    companyName: '',
    companyCnpj: '',
    companyPhone: '',
    companyAddress: ''
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [userFormData, setUserFormData] = useState(initialUserFormData)
  const [companyFormData, setCompanyFormData] = useState(initialCompanyFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { register, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isLoading, isAuthenticated, router])
  
  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCompanyFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'companyPhone') {
      formattedValue = formatPhone(value)
    } else if (name === 'companyCnpj') {
      formattedValue = formatCNPJ(value)
    }

    setCompanyFormData(prev => ({ ...prev, [name]: formattedValue }))
  }
  
  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (userFormData.password !== userFormData.passwordConfirm) {
      setError('As senhas não conferem.')
      return
    }
    
    if (userFormData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    
    setCurrentStep(2)
  }
  
  const handleCompanyFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      // Prepare data for registration
      const registrationData = {
        name: userFormData.name,
        email: userFormData.email,
        password: userFormData.password,
        role: 'ADMIN',
        company: {
          name: companyFormData.companyName,
          cnpj: unformatValue(companyFormData.companyCnpj),
          phone: unformatValue(companyFormData.companyPhone),
          address: companyFormData.companyAddress
        }
      }
      
      // Using the mock register function from AuthContext
      const result = await register(registrationData)
      
      if (result.success) {
        setSuccess(true)
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(result.error || 'Erro ao registrar. Tente novamente.')
      }
    } catch {
      setError('Erro ao processar registro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleBackStep = () => {
    setCurrentStep(1)
    setError(null)
  }
  
  if (isLoading) {
    return <LoadingIndicator fullScreen />
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Sistema Odontológico</h1>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4">
              <p className="text-center">Registro concluído com sucesso! Redirecionando para o dashboard...</p>
            </div>
            <div className="text-center">
              <Link href="/dashboard" className="font-medium text-blue-600 hover:text-blue-500">
                Clique aqui se não for redirecionado automaticamente
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-blue-600">
          Sistema Odontológico
        </h1>
        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
          Criar nova conta
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex-1 text-center ${currentStep === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                  currentStep === 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  1
                </div>
                <div className="mt-2 text-sm">Dados Pessoais</div>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
              <div className={`flex-1 text-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                  currentStep === 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  2
                </div>
                <div className="mt-2 text-sm">Dados da Clínica</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {currentStep === 1 ? (
            <form className="space-y-6" onSubmit={handleUserFormSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={userFormData.name}
                    onChange={handleUserFormChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={userFormData.email}
                    onChange={handleUserFormChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={userFormData.password}
                    onChange={handleUserFormChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                  Confirmar senha <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={userFormData.passwordConfirm}
                    onChange={handleUserFormChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Próximo'}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                  Já tem uma conta? Faça login
                </Link>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleCompanyFormSubmit}>
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Nome da clínica <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={companyFormData.companyName}
                    onChange={handleCompanyFormChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* CNPJ */}
              <div>
                <label htmlFor="companyCnpj" className="block text-sm font-medium text-gray-700">
                  CNPJ <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="companyCnpj"
                    name="companyCnpj"
                    type="text"
                    required
                    value={companyFormData.companyCnpj}
                    onChange={handleCompanyFormChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="companyPhone"
                    name="companyPhone"
                    type="text"
                    required
                    value={companyFormData.companyPhone}
                    onChange={handleCompanyFormChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
                  Endereço <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="companyAddress"
                    name="companyAddress"
                    type="text"
                    required
                    value={companyFormData.companyAddress}
                    onChange={handleCompanyFormChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBackStep}
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Concluir registro'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 