'use client'

import React, { useState, useEffect } from 'react'
import { formatPhone, formatCNPJ, unformatValue } from '@/lib/masks'

interface ProfessionalUser {
  id: string
  name: string
  email: string
  role: string
}

interface Professional {
  id: string
  name: string
  email: string
  phone: string
  cnpj: string
  specialty: string
  bio: string
  user: ProfessionalUser
}

interface ProfessionalFormProps {
  professional?: Professional | null
  onSubmit: (data: Omit<Professional, 'id' | 'user'>) => Promise<void>
  onCancel: () => void
}

// Function to format CPF
function formatCPF(value: string): string {
  // Remove non-numeric characters
  const digits = value.replace(/\D/g, '')
  
  if (digits.length !== 11) {
    return value // Return original if not a valid CPF length
  }
  
  // Apply CPF mask
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Function to detect and format document (CPF or CNPJ)
function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, '')
  
  if (digits.length <= 11) {
    return formatCPF(value)
  } else {
    return formatCNPJ(value)
  }
}

export default function ProfessionalForm({ professional, onSubmit, onCancel }: ProfessionalFormProps) {
  const [formData, setFormData] = useState<Omit<Professional, 'id' | 'user'>>({
    name: '',
    email: '',
    phone: '',
    cnpj: '',
    specialty: '',
    bio: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name,
        email: professional.email,
        phone: professional.phone,
        cnpj: professional.cnpj,
        specialty: professional.specialty,
        bio: professional.bio
      })
    }
  }, [professional])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'phone') {
      formattedValue = formatPhone(value)
    } else if (name === 'cnpj') {
      formattedValue = formatDocument(value)
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Unformat values before submitting
      const submitData = {
        ...formData,
        phone: unformatValue(formData.phone),
        cnpj: unformatValue(formData.cnpj)
      }
      await onSubmit(submitData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar profissional')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm font-medium text-white bg-red-500 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nome completo do profissional"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefone <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
            CPF/CNPJ <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              required
              placeholder="CPF ou CNPJ"
              maxLength={18}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">CPF: 000.000.000-00 ou CNPJ: 00.000.000/0000-00</p>
          </div>
        </div>

        <div>
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
            Especialidade <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Especialidade do profissional"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Biografia
        </label>
        <div className="mt-1">
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Breve biografia do profissional"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
} 