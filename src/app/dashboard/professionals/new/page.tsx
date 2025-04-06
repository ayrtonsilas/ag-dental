'use client'

import { useRouter } from 'next/navigation'
import ProfessionalForm from '@/components/professionals/ProfessionalForm'
import { useNotification } from '@/components/Notification'

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

export default function NewProfessionalPage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  
  const handleSubmit = async (data: Omit<Professional, 'id' | 'user'>) => {
    try {
      // Add password and role for new professionals
      const submitData = {
        ...data,
        password: 'temp123456',
        role: 'USER'
      }
      
      const response = await fetch('/api/professionals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create professional')
      }
      
      showNotification('Profissional criado com sucesso!', 'success')
      showNotification('Senha temporária: temp123456. Por favor, altere na próxima entrada.', 'info', 6000)
      router.push('/dashboard/professionals')
    } catch (error) {
      console.error('Error creating professional:', error)
      showNotification('Erro ao criar profissional. Tente novamente.', 'error')
    }
  }
  
  const handleCancel = () => {
    router.push('/dashboard/professionals')
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Novo Profissional</h1>
        <p className="text-gray-600">Preencha o formulário para cadastrar um novo profissional</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <ProfessionalForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
} 