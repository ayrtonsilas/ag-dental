import React from 'react'

/**
 * Dashboard statistics component
 * Shows summary stats for appointments, patients, and professionals
 */
export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard 
        title="Consultas Hoje"
        count={0}
        label="Consultas agendadas"
        icon={<CalendarIcon />}
        bgColor="bg-blue-100"
        textColor="text-blue-600"
      />
      
      <StatCard 
        title="Pacientes"
        count={0}
        label="Total de pacientes"
        icon={<PatientsIcon />}
        bgColor="bg-green-100"
        textColor="text-green-600"
      />
      
      <StatCard 
        title="Profissionais"
        count={0}
        label="Equipe odontológica"
        icon={<ProfessionalsIcon />}
        bgColor="bg-purple-100"
        textColor="text-purple-600"
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  count: number
  label: string
  icon: React.ReactNode
  bgColor: string
  textColor: string
}

/**
 * Statistic card component
 * Shows a card with a title, count, label, and icon
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  label,
  icon,
  bgColor,
  textColor
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex items-center">
        <div className={`${bgColor} p-3 rounded-full`}>
          <div className={`w-8 h-8 ${textColor}`}>{icon}</div>
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-800">{count}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  )
}

const CalendarIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
)

const PatientsIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
)

const ProfessionalsIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
) 