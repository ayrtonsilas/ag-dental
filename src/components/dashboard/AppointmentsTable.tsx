import React from 'react'

/**
 * Appointments table component
 * Displays upcoming appointments
 */
export const AppointmentsTable: React.FC = () => {
  // In a real implementation, this would fetch data from an API
  const hasAppointments = false
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Próximas Consultas</h2>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Data</TableHeader>
              <TableHeader>Paciente</TableHeader>
              <TableHeader>Profissional</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!hasAppointments && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhuma consulta agendada para os próximos dias
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
}

/**
 * Table header component
 * Displays a table header cell with consistent styling
 */
const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    >
      {children}
    </th>
  )
} 