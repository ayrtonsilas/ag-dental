export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  documentNumber: string
  dateOfBirth: string | null
  gender: string
  address: string
  healthInsurance: string
  healthInsuranceNumber: string
  observations: string
  isFirstVisit: boolean
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export type PatientFormData = Omit<Patient, 'id' | 'user'>

export type AppointmentStatus = 
  | 'SCHEDULED'   // Agendado
  | 'CONFIRMED'   // Confirmado
  | 'IN_PROGRESS' // Em andamento
  | 'COMPLETED'   // Finalizado
  | 'CANCELLED'   // Cancelado
  | 'NO_SHOW'     // Não compareceu

export interface Appointment {
  id: string
  patientId: string
  professionalId: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  treatment?: string
  createdAt: string
  updatedAt: string
  patient?: {
    id: string
    name: string
    phone: string
    email?: string
  }
  professional?: {
    id: string
    name: string
    specialty?: string
  }
} 