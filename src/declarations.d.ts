// Type declarations for custom modules

declare module '@/lib/AuthContext' {
  export interface User {
    id: string
    name: string
    email: string
    role?: string
  }

  export interface RegisterData {
    name: string
    email: string
    password: string
    role: string
    company?: {
      name: string
      cnpj?: string
      phone?: string
      address?: string
    }
  }

  export interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    user: User | null
    login: (email: string, password: string) => Promise<{success: boolean, error?: string}>
    logout: () => Promise<void>
    register: (userData: RegisterData) => Promise<{success: boolean, error?: string}>
    resetPassword: (email: string) => Promise<{success: boolean, error?: string}>
  }

  export function useAuth(): AuthContextType
  export function AuthProvider(props: { children: React.ReactNode }): JSX.Element
}

declare module '@/lib/masks' {
  export function formatCNPJ(value: string): string
  export function formatPhone(value: string): string
  export function unformatValue(value: string): string
}

declare module '@/components/LoadingIndicator' {
  export interface LoadingIndicatorProps {
    fullScreen?: boolean
    message?: string
  }
  
  export const LoadingIndicator: React.FC<LoadingIndicatorProps>
}

declare module '@/components/SidebarLayout' {
  export interface SidebarLayoutProps {
    children: React.ReactNode
  }
  
  const SidebarLayout: React.FC<SidebarLayoutProps>
  export default SidebarLayout
}

declare module '@/components/dashboard/DashboardStats' {
  export const DashboardStats: React.FC
}

declare module '@/components/dashboard/UserInfoSection' {
  import { User } from '@/lib/AuthContext'
  
  export interface UserInfoSectionProps {
    user: User | null
  }
  
  export const UserInfoSection: React.FC<UserInfoSectionProps>
}

declare module '@/components/dashboard/CompanyInfoSection' {
  export interface CompanyInfoSectionProps {
    company: {
      name: string
      cnpj?: string
      phone?: string
      address?: string
    }
  }
  
  export const CompanyInfoSection: React.FC<CompanyInfoSectionProps>
}

declare module '@/components/dashboard/AppointmentsTable' {
  export const AppointmentsTable: React.FC
} 