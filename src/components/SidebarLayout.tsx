'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'

// Icon components
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
)

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
)

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
)

const ToothIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 0 0-7 7c0 2.5 2 5 3 6 1.4 1.4 2 3.5 2 6h4c0-2.5.6-4.6 2-6 1-1 3-3.5 3-6a7 7 0 0 0-7-7Z" />
    <path d="M8 14c-1-1-4-3-4-7a8 8 0 0 1 16 0c0 4-3 6-4 7" />
  </svg>
)

const PatientIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
)

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm10 1.414L14.586 6H13V4.414zM3 7h10v1H3V7zm0 3h10v1H3v-1zm0 3h10v1H3v-1z" clipRule="evenodd" />
  </svg>
)

interface SidebarLayoutProps {
  children: React.ReactNode
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Define navigation items based on role
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,
      roles: ['ADMIN', 'DENTIST', 'RECEPTIONIST', 'PATIENT'],
    },
    {
      name: 'Pacientes',
      href: '/patients',
      icon: <PatientIcon />,
      roles: ['ADMIN', 'DENTIST', 'RECEPTIONIST'],
    },
    {
      name: 'Profissionais',
      href: '/professionals',
      icon: <ToothIcon />,
      roles: ['ADMIN'],
    },
    {
      name: 'Consultas',
      href: '/appointments',
      icon: <CalendarIcon />,
      roles: ['ADMIN', 'DENTIST', 'RECEPTIONIST', 'PATIENT'],
    },
    {
      name: 'Usuários',
      href: '/users',
      icon: <UsersIcon />,
      roles: ['ADMIN'],
    },
  ]

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  )

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white shadow">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-semibold text-blue-600">Gestão Consultórios</h1>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1 bg-white">
                {filteredNavItems.map(item => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <div className={`${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0`}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div className="inline-block h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 leading-none">
                    <span className="flex items-center justify-center w-full h-full">{user?.name?.substring(0, 1).toUpperCase() || 'U'}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.name || 'Usuário'}</p>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-gray-500 flex items-center"
                    >
                      <LogoutIcon />
                      <span className="ml-1">Sair</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden bg-white shadow-sm w-full flex items-center justify-between px-4 py-2">
        <h1 className="text-lg font-semibold text-blue-600">Gestão Consultórios</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-14">
          <nav className="px-4 py-2 space-y-1">
            {filteredNavItems.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-3 text-base font-medium rounded-md`}
                >
                  <div className={`${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-4 flex-shrink-0`}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              )
            })}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center">
                <div className="inline-block h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 leading-none">
                  <span className="flex items-center justify-center w-full h-full">{user?.name?.substring(0, 1).toUpperCase() || 'U'}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'Usuário'}</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-gray-500 flex items-center mt-1"
                  >
                    <LogoutIcon />
                    <span className="ml-1">Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  )
} 