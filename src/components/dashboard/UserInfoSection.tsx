import React from 'react'
import { User } from '@prisma/client'

interface UserInfoSectionProps {
  user: User
}

/**
 * User information section component
 * Displays details about the logged-in user
 */
export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ user }) => {
  // Get role display text
  const getRoleDisplay = (role: string): string => {
    switch (role) {
      case 'ADMIN': return 'Administrador'
      case 'DENTIST': return 'Dentista'
      case 'RECEPTIONIST': return 'Recepcionista'
      case 'PATIENT': return 'Paciente'
      default: return role
    }
  }
  
  const infoItems = [
    { label: 'Nome', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Função', value: getRoleDisplay(user.role) }
  ]
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Usuário</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          <InfoItem key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
}

/**
 * Info item component
 * Displays a label and value pair
 */
const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-800">{value || '-'}</p>
    </div>
  )
} 