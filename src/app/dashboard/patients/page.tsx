'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PatientsList from '@/components/patients/PatientsList'
import PatientForm from '@/components/patients/PatientForm'
import { useNotification } from '@/components/Notification'

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
}

export default function PatientsPage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  
  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditing(true)
  }
  
  const handleView = (id: string) => {
    router.push(`/dashboard/patients/${id}`)
  }
  
  const handleDelete = async (id: string) => {
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
      window.location.reload()
    } catch (error) {
      console.error('Error deleting patient:', error)
      showNotification('Erro ao excluir paciente. Tente novamente.', 'error')
    }
  }
  
  const handleSubmit = async (data: Omit<Patient, 'id'>) => {
    try {
      const url = selectedPatient 
        ? `/api/patients/${selectedPatient.id}` 
        : '/api/patients'
      
      const method = selectedPatient ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to ${selectedPatient ? 'update' : 'create'} patient`)
      }
      
      setIsEditing(false)
      setSelectedPatient(null)
      showNotification(`Paciente ${selectedPatient ? 'atualizado' : 'criado'} com sucesso!`, 'success')
      window.location.reload()
    } catch (error) {
      console.error('Error submitting patient:', error)
      showNotification(`Erro ao ${selectedPatient ? 'atualizar' : 'criar'} paciente. Tente novamente.`, 'error')
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setSelectedPatient(null)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Gerenciamento de pacientes da clínica</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Novo Paciente
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {selectedPatient ? 'Editar Paciente' : 'Novo Paciente'}
          </h2>
          <PatientForm
            patient={selectedPatient}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <PatientsList
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  )
} 