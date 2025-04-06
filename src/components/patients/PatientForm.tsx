import React, { useState, useEffect } from 'react'
import { formatPhone, unformatValue } from '@/lib/masks'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  healthInsurance: string
  healthInsuranceNumber: string
  observations: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface PatientFormProps {
  patient?: Patient
  onSubmit: (data: Omit<Patient, 'id' | 'user'>) => Promise<void>
  onCancel: () => void
}

export default function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState<Omit<Patient, 'id' | 'user'>>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    healthInsurance: '',
    healthInsuranceNumber: '',
    observations: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        healthInsurance: patient.healthInsurance,
        healthInsuranceNumber: patient.healthInsuranceNumber,
        observations: patient.observations
      })
    }
  }, [patient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'phone') {
      formattedValue = formatPhone(value)
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
        phone: unformatValue(formData.phone)
      }
      await onSubmit(submitData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar paciente')
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
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
          Data de Nascimento <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gênero <span className="text-red-500">*</span>
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="O">Outro</option>
        </select>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Endereço <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="healthInsurance" className="block text-sm font-medium text-gray-700">
          Plano de Saúde <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="healthInsurance"
          name="healthInsurance"
          value={formData.healthInsurance}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="healthInsuranceNumber" className="block text-sm font-medium text-gray-700">
          Número do Plano <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="healthInsuranceNumber"
          name="healthInsuranceNumber"
          value={formData.healthInsuranceNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          id="observations"
          name="observations"
          value={formData.observations}
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
          {loading ? 'Salvando...' : patient ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
    </form>
  )
} 