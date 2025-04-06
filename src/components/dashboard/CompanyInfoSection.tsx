import React from 'react'
import { formatPhone, formatCNPJ } from '@/lib/masks'

interface InfoItemProps {
  label: string
  value: string | null | undefined
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
)

interface CompanyInfoSectionProps {
  company: {
    name: string
    cnpj?: string | null
    phone?: string | null
    address?: string | null
  }
}

/**
 * Company information section component
 * Displays details about the company
 */
export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ company }) => {
  const infoItems = [
    { label: 'Nome da empresa', value: company.name },
    { label: 'CNPJ', value: company.cnpj ? formatCNPJ(company.cnpj) : '-' },
    { label: 'Telefone', value: company.phone ? formatPhone(company.phone) : '-' },
    { label: 'Endereço', value: company.address || '-' }
  ]
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações da Empresa</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          <InfoItem key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  )
} 