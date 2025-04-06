'use client'

import React, { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'

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

interface PatientsListProps {
  onEdit: (patient: Patient) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

export default function PatientsList({ onEdit, onDelete, onView }: PatientsListProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  
  const fetchPatients = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search
      }).toString()
      
      const response = await fetch(`/api/patients?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients')
      }
      
      const data = await response.json()
      setPatients(data.patients)
      setTotalPages(data.pagination.totalPages)
      setTotalItems(data.pagination.total)
    } catch (err) {
      setError('Error loading patients. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchPatients()
  }, [page, pageSize, search])
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page when searching
    fetchPatients()
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
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 items-center space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">Pacientes</h2>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar pacientes..."
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
      ) : patients.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {search ? 'Nenhum paciente encontrado para esta busca.' : 'Nenhum paciente cadastrado.'}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número do Documento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Nascimento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gênero</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{patient.documentNumber || '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(patient.dateOfBirth)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatGender(patient.gender)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onView(patient.id)}
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
                          onClick={() => onEdit(patient)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          title="Editar paciente"
                        >
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(patient.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Excluir paciente"
                        >
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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