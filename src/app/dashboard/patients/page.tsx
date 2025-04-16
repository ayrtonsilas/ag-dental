'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PatientsList from '@/components/patients/PatientsList'
import PatientForm from '@/components/patients/PatientForm'
import { useNotification } from '@/components/Notification'
import { Patient, PatientFormData } from '@/types'

export default function PatientsPage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete patient')
      }
      
      showNotification('Paciente excluído com sucesso!', 'success')
      window.location.reload()
    } catch (error) {
      console.error('Error deleting patient:', error)
      showNotification(
        error instanceof Error ? error.message : 'Erro ao excluir paciente. Tente novamente.',
        'error'
      )
    }
  }
  
  const handleSubmit = async (data: PatientFormData) => {
    try {
      setIsSubmitting(true)
      
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
        const error = await response.json()
        throw new Error(error.error || `Failed to ${selectedPatient ? 'update' : 'create'} patient`)
      }
      
      setIsEditing(false)
      setSelectedPatient(null)
      showNotification(`Paciente ${selectedPatient ? 'atualizado' : 'criado'} com sucesso!`, 'success')
      window.location.reload()
    } catch (error) {
      console.error('Error submitting patient:', error)
      showNotification(
        error instanceof Error ? error.message : `Erro ao ${selectedPatient ? 'atualizar' : 'criar'} paciente. Tente novamente.`,
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setSelectedPatient(null)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Novo Paciente
        </button>
      </div>
      
      {isEditing ? (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {selectedPatient ? 'Editar Paciente' : 'Novo Paciente'}
          </h2>
          <PatientForm
            patient={selectedPatient}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={isSubmitting}
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