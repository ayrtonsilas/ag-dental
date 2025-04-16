'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PatientForm from '@/components/patients/PatientForm'
import { useNotification } from '@/components/Notification'
import { useParams } from 'next/navigation'
import { Patient, PatientFormData } from '@/types'

export default function PatientDetailPage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const params = useParams()
  const id = params.id as string
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/patients/${id}`)
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to fetch patient')
        }
        
        const data = await response.json()
        setPatient(data)
      } catch (error) {
        console.error('Error fetching patient:', error)
        setError(error instanceof Error ? error.message : 'Erro ao carregar paciente')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPatient()
  }, [id])
  
  const handleSubmit = async (data: PatientFormData) => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update patient')
      }
      
      const updatedPatient = await response.json()
      setPatient(updatedPatient)
      setIsEditing(false)
      showNotification('Paciente atualizado com sucesso!', 'success')
    } catch (error) {
      console.error('Error updating patient:', error)
      showNotification(
        error instanceof Error ? error.message : 'Erro ao atualizar paciente. Tente novamente.',
        'error'
      )
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
  }
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }
  
  // Format gender for display
  const formatGender = (gender: string) => {
    switch (gender) {
      case 'M': return 'Masculino'
      case 'F': return 'Feminino'
      case 'O': return 'Outro'
      default: return '-'
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-600">Carregando dados do paciente...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar paciente</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard/patients')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para lista de pacientes
          </button>
        </div>
      </div>
    )
  }
  
  if (!patient) {
    return null
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes do Paciente</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Cancelar Edição' : 'Editar Paciente'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Editar Paciente</h2>
          <PatientForm
            patient={patient}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Informações do Paciente</h2>
          </div>
          <div className="px-6 py-5">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Número do Documento</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.documentNumber || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Data de Nascimento</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(patient.dateOfBirth)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gênero</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatGender(patient.gender)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.address || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Convênio</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.healthInsurance || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Número do Convênio</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.healthInsuranceNumber || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Observações</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.observations || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Primeira Consulta</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {patient.isFirstVisit ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Sim
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Não
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
} 