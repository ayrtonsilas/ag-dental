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