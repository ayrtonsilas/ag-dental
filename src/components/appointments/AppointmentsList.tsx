'use client'

import { useState, useEffect } from 'react'
import { Appointment, AppointmentStatus } from '@/types'
import { formatDate } from '@/lib/dateUtils'

interface AppointmentsListProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
  onRefresh: () => void
  isLoading: boolean
}

export default function AppointmentsList({
  appointments,
  onEdit,
  onDelete,
  onStatusChange,
  onRefresh,
  isLoading
}: AppointmentsListProps) {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL')
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments)

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredAppointments(appointments)
    } else {
      setFilteredAppointments(appointments.filter(app => app.status === statusFilter))
    }
  }, [appointments, statusFilter])

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Agendado'
      case 'CONFIRMED':
        return 'Confirmado'
      case 'IN_PROGRESS':
        return 'Em andamento'
      case 'COMPLETED':
        return 'Finalizado'
      case 'CANCELLED':
        return 'Cancelado'
      case 'NO_SHOW':
        return 'Não compareceu'
      default:
        return status
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por status
          </label>
          <select
            id="statusFilter"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as AppointmentStatus | 'ALL')}
          >
            <option value="ALL">Todos</option>
            <option value="SCHEDULED">Agendado</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="COMPLETED">Finalizado</option>
            <option value="CANCELLED">Cancelado</option>
            <option value="NO_SHOW">Não compareceu</option>
          </select>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profissional
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horário
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Carregando consultas...
                </td>
              </tr>
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhuma consulta encontrada
                </td>
              </tr>
            ) : (
              filteredAppointments.map(appointment => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appointment.patient?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.professional?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(appointment.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.startTime} - {appointment.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => onEdit(appointment)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    
                    <button
                      onClick={() => onDelete(appointment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                    
                    {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                      <select
                        value={appointment.status}
                        onChange={e => onStatusChange(appointment.id, e.target.value as AppointmentStatus)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="SCHEDULED">Agendado</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="IN_PROGRESS">Em andamento</option>
                        <option value="COMPLETED">Finalizado</option>
                        <option value="CANCELLED">Cancelado</option>
                        <option value="NO_SHOW">Não compareceu</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 