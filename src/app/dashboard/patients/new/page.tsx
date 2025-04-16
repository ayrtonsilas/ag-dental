'use client'

import { useRouter } from 'next/navigation'
import PatientForm from '@/components/patients/PatientForm'
import { useNotification } from '@/components/Notification'
import { PatientFormData } from '@/types'

export default function NewPatientPage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  
  const handleSubmit = async (data: PatientFormData) => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create patient')
      }
      
      showNotification('Paciente criado com sucesso!', 'success')
      router.push('/dashboard/patients')
    } catch (error) {
      console.error('Error creating patient:', error)
      showNotification(
        error instanceof Error ? error.message : 'Erro ao criar paciente. Tente novamente.',
        'error'
      )
    }
  }
  
  const handleCancel = () => {
    router.push('/dashboard/patients')
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Novo Paciente</h1>
        <p className="text-gray-600">Preencha o formulário para cadastrar um novo paciente</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <PatientForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
} 