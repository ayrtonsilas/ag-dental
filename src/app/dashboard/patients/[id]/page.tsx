'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PatientForm from '@/components/patients/PatientForm'
import { useNotification } from '@/components/Notification'
import { useParams } from 'next/navigation'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  documentNumber: string
  dateOfBirth: string | null
  gender: string
  address: string
  healthInsurance: string
  healthInsuranceNumber: string
  observations: string
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface PageProps {
  params: {
    id: string
  }
}

export default function PatientDetailPage({ params }: PageProps) {
  // Use the useParams hook, which is the recommended way in newer Next.js versions
  const routeParams = useParams<{ id: string }>()
  const id = routeParams.id || params.id // Fallback to props params if needed
  const router = useRouter()
  const { showNotification } = useNotification()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Patient not found')
          }
          throw new Error('Failed to fetch patient data')
        }
        
        const data = await response.json()
        setPatient(data)
      } catch (err) {
        setError('Erro ao carregar paciente. Por favor, tente novamente.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPatient()
  }, [id])
  
  const handleEdit = () => {
    setIsEditing(true)
  }
  
  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este paciente?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete patient')
      }
      
      showNotification('Paciente excluído com sucesso!', 'success')
      router.push('/dashboard/patients')
    } catch (error) {
      console.error('Error deleting patient:', error)
      showNotification('Erro ao excluir paciente. Tente novamente.', 'error')
    }
  }
  
  const handleSubmit = async (data: Omit<Patient, 'id'>) => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update patient')
      }
      
      const updatedPatient = await response.json()
      setPatient(updatedPatient)
      setIsEditing(false)
      showNotification('Paciente atualizado com sucesso!', 'success')
    } catch (error) {
      console.error('Error updating patient:', error)
      showNotification('Erro ao atualizar paciente. Tente novamente.', 'error')
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
  
  if (error || !patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Erro</h2>
          <p>{error || 'Paciente não encontrado'}</p>
          <button 
            onClick={() => router.push('/dashboard/patients')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar para lista de pacientes
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
          <p className="text-gray-600">Detalhes do paciente</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => router.push('/dashboard/patients')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Voltar
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
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
                <dt className="text-sm font-medium text-gray-500">Plano de Saúde</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.healthInsurance || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Número da Carteirinha</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.healthInsuranceNumber || '-'}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Observações</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{patient.observations || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
} 