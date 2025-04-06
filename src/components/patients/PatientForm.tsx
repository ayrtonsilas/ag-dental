import React, { useState, useEffect } from 'react'
import { formatPhone, unformatValue } from '@/lib/masks'
import { Patient, PatientFormData } from '@/types'

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

interface PatientFormProps {
  patient?: Patient | null
  onSubmit: (data: PatientFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function PatientForm({ patient, onSubmit, onCancel, loading: externalLoading }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    email: '',
    phone: '',
    documentNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    healthInsurance: '',
    healthInsuranceNumber: '',
    observations: '',
    isFirstVisit: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (patient) {
      // Format the dateOfBirth from ISO string to YYYY-MM-DD for the input field
      let formattedDate = ''
      if (patient.dateOfBirth) {
        // Extract the YYYY-MM-DD part from the ISO string
        formattedDate = patient.dateOfBirth.split('T')[0]
      }
      
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        documentNumber: patient.documentNumber || '',
        dateOfBirth: formattedDate,
        gender: patient.gender,
        address: patient.address,
        healthInsurance: patient.healthInsurance,
        healthInsuranceNumber: patient.healthInsuranceNumber,
        observations: patient.observations,
        isFirstVisit: patient.isFirstVisit || false
      })
    }
  }, [patient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'phone') {
      formattedValue = formatPhone(value)
    }
    else if (name === 'documentNumber') {
      formattedValue = formatCPF(value)
    }
    else if (name === 'healthInsuranceNumber' && value.length > 0) {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-')
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = {
        ...formData,
        phone: unformatValue(formData.phone),
        documentNumber: unformatValue(formData.documentNumber),
        healthInsuranceNumber: formData.healthInsuranceNumber ? formData.healthInsuranceNumber.replace(/\D/g, '') : '',
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        isFirstVisit: Boolean(formData.isFirstVisit)
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
              placeholder="Nome completo do paciente"
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
          <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">
            Número do Documento <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              placeholder="Ex: CPF, RG ou outro documento"
              maxLength={14}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">CPF: 000.000.000-00 ou outro tipo de documento</p>
          </div>
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Data de Nascimento <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gênero <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="healthInsurance" className="block text-sm font-medium text-gray-700">
            Plano de Saúde
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="healthInsurance"
              name="healthInsurance"
              value={formData.healthInsurance}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nome do plano de saúde (opcional)"
            />
          </div>
        </div>

        <div>
          <label htmlFor="healthInsuranceNumber" className="block text-sm font-medium text-gray-700">
            Número da Carteirinha
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="healthInsuranceNumber"
              name="healthInsuranceNumber"
              value={formData.healthInsuranceNumber}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Número da carteirinha do plano (opcional)"
            />
            <p className="mt-1 text-xs text-gray-500">Exemplo: 1234-5678-9012-3456</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFirstVisit"
              name="isFirstVisit"
              checked={formData.isFirstVisit}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFirstVisit" className="ml-2 block text-sm text-gray-700">
              Primeira consulta
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">Marque esta opção se esta for a primeira consulta do paciente</p>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Endereço <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Endereço completo"
          />
        </div>
      </div>

      <div>
        <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <div className="mt-1">
          <textarea
            id="observations"
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            rows={3}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Observações adicionais sobre o paciente"
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
          disabled={loading || externalLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || externalLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
} 