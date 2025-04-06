'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

interface PageProps {
  params: {
    id: string
  }
}

export default function ProfessionalDetailPage({ params }: PageProps) {
  const routeParams = useParams<{ id: string }>()
  const id = routeParams.id || params.id
  const router = useRouter()
  const { showNotification } = useNotification()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await fetch(`/api/professionals/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Professional not found')
          }
          throw new Error('Failed to fetch professional data')
        }
        
        const data = await response.json()
        setProfessional(data)
      } catch (err) {
        setError('Erro ao carregar profissional. Por favor, tente novamente.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfessional()
  }, [id])
  
  const handleEdit = () => {
    setIsEditing(true)
  }
  
  const handleDelete = async () => {
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
      router.push('/dashboard/professionals')
    } catch (error) {
      console.error('Error deleting professional:', error)
      showNotification('Erro ao excluir profissional. Tente novamente.', 'error')
    }
  }
  
  const handleSubmit = async (data: Omit<Professional, 'id' | 'user'>) => {
    try {
      const response = await fetch(`/api/professionals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update professional')
      }
      
      const updatedProfessional = await response.json()
      setProfessional(updatedProfessional)
      setIsEditing(false)
      showNotification('Profissional atualizado com sucesso!', 'success')
    } catch (error) {
      console.error('Error updating professional:', error)
      showNotification('Erro ao atualizar profissional. Tente novamente.', 'error')
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
  }
  
  const formatRole = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador'
      case 'USER': return 'Usuário'
      case 'SUPER_ADMIN': return 'Super Admin'
      default: return role
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-600">Carregando dados do profissional...</p>
        </div>
      </div>
    )
  }
  
  if (error || !professional) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Erro</h2>
          <p>{error || 'Profissional não encontrado'}</p>
          <button 
            onClick={() => router.push('/dashboard/professionals')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar para lista de profissionais
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{professional.name}</h1>
          <p className="text-gray-600">Detalhes do profissional</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => router.push('/dashboard/professionals')}
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
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Editar Profissional</h2>
          <ProfessionalForm
            professional={professional}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Informações do Profissional</h2>
          </div>
          <div className="px-6 py-5">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="mt-1 text-sm text-gray-900">{professional.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{professional.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="mt-1 text-sm text-gray-900">{professional.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
                <dd className="mt-1 text-sm text-gray-900">{professional.cnpj || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Especialidade</dt>
                <dd className="mt-1 text-sm text-gray-900">{professional.specialty || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Função</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatRole(professional.user.role)}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Biografia</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{professional.bio || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
} 