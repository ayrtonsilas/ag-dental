'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import SidebarLayout from '@/components/SidebarLayout'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { UserInfoSection } from '@/components/dashboard/UserInfoSection'
import { CompanyInfoSection } from '@/components/dashboard/CompanyInfoSection'
import { AppointmentsTable } from '@/components/dashboard/AppointmentsTable'
import { LoadingIndicator } from '@/components/LoadingIndicator'

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Mock company data - this would come from an API in a real application
  const companyData = {
    name: 'Sistema Odontológico',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 98765-4321',
    address: 'Av. Paulista, 123 - São Paulo, SP'
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (!isLoading && isAuthenticated) {
      setLoading(false)
    }
  }, [isAuthenticated, isLoading, router])

  if (loading || isLoading) {
    return <LoadingIndicator fullScreen message="Carregando dashboard..." />
  }

  return (
    <SidebarLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Olá, {user?.name || 'Usuário'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 md:mt-0">
            Hoje é {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Dashboard Statistics */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Upcoming Appointments */}
            <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Próximas Consultas
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Consultas agendadas para os próximos dias
                </p>
              </div>
              <div className="px-4 py-3 sm:px-6">
                <AppointmentsTable />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* User Information */}
            <UserInfoSection user={user} />
            
            {/* Company Information */}
            <CompanyInfoSection company={companyData} />
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
} 