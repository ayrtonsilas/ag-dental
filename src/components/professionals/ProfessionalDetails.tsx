'use client'

import React from 'react'

interface ProfessionalUser {
  id: string
  name: string
  email: string
  role: string
}

interface Professional {
  id: string
  specialty: string
  licenseNumber: string | null
  bio: string | null
  user: ProfessionalUser
}

interface ProfessionalDetailsProps {
  professional: Professional
}

export default function ProfessionalDetails({ professional }: ProfessionalDetailsProps) {
  return (
    <div className="px-4 py-3 bg-gray-50 rounded-md mb-4">
      <h3 className="font-medium text-lg mb-2">Detalhes do Profissional</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Nome</p>
          <p>{professional.user.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p>{professional.user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Especialidade</p>
          <p>{professional.specialty}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Registro</p>
          <p>{professional.licenseNumber || 'Não informado'}</p>
        </div>
        {professional.bio && (
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Biografia/Formação</p>
            <p className="whitespace-pre-line">{professional.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
} 