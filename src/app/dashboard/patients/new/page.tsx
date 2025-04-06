'use client'

import { useRouter } from 'next/navigation'
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
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function NewPatientPage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  
  const handleSubmit = async (data: Omit<Patient, 'id' | 'user'>) => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create patient')
      }
      
      showNotification('Paciente criado com sucesso!', 'success')
      router.push('/dashboard/patients')
    } catch (error) {
      console.error('Error creating patient:', error)
      showNotification('Erro ao criar paciente. Tente novamente.', 'error')
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