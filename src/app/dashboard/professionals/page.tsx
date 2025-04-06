'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfessionalsList from '@/components/professionals/ProfessionalsList'
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

export default function ProfessionalsPage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  
  const handleEdit = (professional: Professional) => {
    setSelectedProfessional(professional)
    setIsEditing(true)
  }
  
  const handleView = (id: string) => {
    router.push(`/dashboard/professionals/${id}`)
  }
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este profissional?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/professionals/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete professional')
      }
      
      showNotification('Profissional excluído com sucesso!', 'success')
      window.location.reload()
    } catch (error) {
      console.error('Error deleting professional:', error)
      showNotification('Erro ao excluir profissional. Tente novamente.', 'error')
    }
  }
  
  const handleSubmit = async (data: Omit<Professional, 'id' | 'user'>) => {
    try {
      const url = selectedProfessional 
        ? `/api/professionals/${selectedProfessional.id}` 
        : '/api/professionals'
      
      const method = selectedProfessional ? 'PUT' : 'POST'
      
      // Add password for new professionals
      const submitData = !selectedProfessional 
        ? { ...data, password: 'temp123456', role: 'USER' } 
        : data
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to ${selectedProfessional ? 'update' : 'create'} professional`)
      }
      
      setIsEditing(false)
      setSelectedProfessional(null)
      showNotification(`Profissional ${selectedProfessional ? 'atualizado' : 'criado'} com sucesso!`, 'success')
      
      if (!selectedProfessional) {
        showNotification('Senha temporária: temp123456. Por favor, altere na próxima entrada.', 'info', 6000)
      }
      
      window.location.reload()
    } catch (error) {
      console.error('Error submitting professional:', error)
      showNotification(`Erro ao ${selectedProfessional ? 'atualizar' : 'criar'} profissional. Tente novamente.`, 'error')
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setSelectedProfessional(null)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
          <p className="text-gray-600">Gerenciamento de profissionais da clínica</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Novo Profissional
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {selectedProfessional ? 'Editar Profissional' : 'Novo Profissional'}
          </h2>
          <ProfessionalForm
            professional={selectedProfessional}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <ProfessionalsList
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  )
} 