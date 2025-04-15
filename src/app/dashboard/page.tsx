'use client'

import { useAuth } from '@/lib/AuthContext'
import { formatCNPJ } from '@/lib/masks'

export default function DashboardPage() {
  // Use type assertions to work around TypeScript errors
  const auth = useAuth() as unknown
  const { user, company } = auth as { 
    user: { name?: string; email?: string; role?: string },
    company: { name: string; document: string } | null 
  }

  // Format CNPJ for display
  const displayCNPJ = (cnpj: string) => {
    if (!cnpj) return '-'
    return formatCNPJ(cnpj)
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* User info card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Informações do Usuário</h2>
          <p className="mt-1 text-sm text-gray-500">Detalhes pessoais e do consultório</p>
        </div>
        <div className="px-6 py-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nome completo</dt>
              <dd className="mt-1 text-base font-medium text-gray-900">{user?.name || 'Não informado'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-base font-medium text-gray-900">{user?.email || 'Não informado'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Função</dt>
              <dd className="mt-1 text-base font-medium text-gray-900">
                {user?.role === 'ADMIN' ? 'Administrador' : 
                 user?.role === 'SUPER_ADMIN' ? 'Super Administrador' : 'Usuário'}
              </dd>
            </div>
            {company && (
              <>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Empresa</dt>
                  <dd className="mt-1 text-base font-medium text-gray-900">{company.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
                  <dd className="mt-1 text-base font-medium text-gray-900">{displayCNPJ(company.document)}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-5 py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-xl p-3">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-blue-100 truncate">Total de Pacientes</dt>
                  <dd className="text-3xl font-semibold text-white">0</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-black bg-opacity-10 px-5 py-3">
            <a href="#" className="text-sm font-medium text-blue-100 hover:text-white flex items-center">
              Ver todos
              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-5 py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-xl p-3">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-indigo-100 truncate">Consultas Hoje</dt>
                  <dd className="text-3xl font-semibold text-white">0</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-black bg-opacity-10 px-5 py-3">
            <a href="#" className="text-sm font-medium text-indigo-100 hover:text-white flex items-center">
              Ver agenda
              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-5 py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-xl p-3">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-purple-100 truncate">Recebimentos Pendentes</dt>
                  <dd className="text-3xl font-semibold text-white">R$ 0,00</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-black bg-opacity-10 px-5 py-3">
            <a href="#" className="text-sm font-medium text-purple-100 hover:text-white flex items-center">
              Ver financeiro
              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Ações Rápidas</h2>
          <p className="mt-1 text-sm text-gray-500">Acesse as principais funcionalidades do sistema</p>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Novo Paciente</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Agendar Consulta</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Novo Prontuário</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Registrar Pagamento</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 