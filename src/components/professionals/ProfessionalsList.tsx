'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Pagination from '@/components/Pagination'
import { formatPhone, formatCNPJ } from '@/lib/masks'

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

interface ProfessionalsListProps {
  onEdit: (professional: Professional) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

export default function ProfessionalsList({ onEdit, onDelete, onView }: ProfessionalsListProps) {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  
  const fetchProfessionals = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search
      }).toString()
      
      const response = await fetch(`/api/professionals?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch professionals')
      }
      
      const data = await response.json()
      setProfessionals(data.professionals)
      setTotalPages(data.pagination.totalPages)
      setTotalItems(data.pagination.total)
    } catch (err) {
      setError('Error loading professionals. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search])
  
  useEffect(() => {
    fetchProfessionals()
  }, [fetchProfessionals])
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page when searching
    fetchProfessionals()
  }
  
  // Format role for display
  const formatRole = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador'
      case 'USER': return 'Usuário'
      case 'SUPER_ADMIN': return 'Super Admin'
      default: return role
    }
  }
  
  // Format CNPJ for display
  const displayCNPJ = (cnpj: string) => {
    if (!cnpj) return '-'
    return formatCNPJ(cnpj)
  }
  
  // Format phone for display
  const displayPhone = (phone: string) => {
    if (!phone) return '-'
    return formatPhone(phone)
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 items-center space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">Profissionais</h2>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar profissionais..."
              className="border rounded-l-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
      
      {error && (
        <div className="p-3 text-sm font-medium text-white bg-red-500 rounded-lg mb-4">{error}</div>
      )}
      
      {loading ? (
        <div className="py-10 text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : professionals.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {search ? 'Nenhum profissional encontrado para esta busca.' : 'Nenhum profissional cadastrado.'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {professionals.map(professional => {
                  return (
                    <tr key={professional.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{professional.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{professional.email}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{displayPhone(professional.phone)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{displayCNPJ(professional.cnpj)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{professional.specialty || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatRole(professional.user.role)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onView(professional.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            title="Ver detalhes"
                          >
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                          </button>
                          <button
                            onClick={() => onEdit(professional)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            title="Editar profissional"
                          >
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => onDelete(professional.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Excluir profissional"
                          >
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={pageSize}
              totalItems={totalItems}
            />
          </div>
        </>
      )}
    </div>
  )
} 