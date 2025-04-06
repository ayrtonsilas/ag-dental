'use client'

import React, { useState, useEffect } from 'react'
import { formatPhone, formatCnpj, unformatValue } from '@/lib/masks'

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
  professional?: Professional
  onSubmit: (data: Omit<Professional, 'id' | 'user'>) => Promise<void>
  onCancel: () => void
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
      formattedValue = formatCnpj(value)
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Telefone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="(00) 00000-0000"
          maxLength={15}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
          CNPJ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="cnpj"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          required
          placeholder="00.000.000/0000-00"
          maxLength={18}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
          Especialidade <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Biografia
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : professional ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
    </form>
  )
} 