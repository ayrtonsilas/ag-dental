'use client'

import { useState, useEffect } from 'react'
import { Appointment, AppointmentStatus } from '@/types'
import { generateTimeSlots, getInputDateFormat } from '@/lib/dateUtils'

interface AppointmentModalProps {
  appointment: Appointment | null
  onClose: () => void
  onSubmit: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  professionals: { id: string, name: string }[]
}

export default function AppointmentModal({
  appointment,
  onClose,
  onSubmit,
  professionals
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    professionalId: '',
    date: getInputDateFormat(new Date()),
    startTime: '08:00',
    endTime: '08:30',
    status: 'SCHEDULED' as AppointmentStatus,
    notes: '',
    treatment: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [patients, setPatients] = useState<{ id: string, name: string }[]>([])
  const [patientSearchQuery, setPatientSearchQuery] = useState('')
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState<{ id: string, name: string }[]>([])
  
  // Fetch patients data
  useEffect(() => {
    fetchPatients()
    
    // Generate time slots from 8:00 to 18:00 with 30min intervals
    setTimeSlots(generateTimeSlots('08:00', '18:00', 30))
    
    // Set form data if editing an existing appointment
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        patientName: appointment.patient?.name || '',
        professionalId: appointment.professionalId,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        notes: appointment.notes || '',
        treatment: appointment.treatment || ''
      })
    }
  }, [appointment])
  
  // Filter patients based on search query
  useEffect(() => {
    if (patientSearchQuery) {
      setFilteredPatients(
        patients.filter(patient => 
          patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredPatients(patients)
    }
  }, [patientSearchQuery, patients])
  
  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients?pageSize=100')
      if (!response.ok) {
        throw new Error('Failed to fetch patients')
      }
      
      const data = await response.json()
      setPatients(data.patients.map((patient: { id: string; name: string; }) => ({
        id: patient.id,
        name: patient.name
      })))
    } catch (error) {
      console.error('Error fetching patients:', error)
      setError('Erro ao buscar pacientes')
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Special case for time selection: ensure end time is after start time
    if (name === 'startTime') {
      const currentEndTime = formData.endTime
      const startTimeIndex = timeSlots.findIndex(slot => slot === value)
      const endTimeIndex = timeSlots.findIndex(slot => slot === currentEndTime)
      
      // If end time is before or equal to new start time, automatically adjust it
      if (endTimeIndex <= startTimeIndex) {
        const newEndTimeIndex = Math.min(startTimeIndex + 1, timeSlots.length - 1)
        setFormData(prev => ({
          ...prev,
          [name]: value,
          endTime: timeSlots[newEndTimeIndex]
        }))
        return
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const selectPatient = (patient: { id: string, name: string }) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name
    }))
    setShowPatientSearch(false)
    setPatientSearchQuery('')
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!formData.patientId || !formData.professionalId || !formData.date || !formData.startTime || !formData.endTime) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }
      
      // Validate start time before end time
      if (formData.startTime >= formData.endTime) {
        throw new Error('O horário de início deve ser anterior ao horário de término')
      }
      
      // Format data for submission
      const submitData = {
        patientId: formData.patientId,
        professionalId: formData.professionalId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.status,
        notes: formData.notes,
        treatment: formData.treatment
      }
      
      await onSubmit(submitData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar consulta')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const statusOptions = [
    { value: 'SCHEDULED', label: 'Agendado' },
    { value: 'CONFIRMED', label: 'Confirmado' },
    { value: 'IN_PROGRESS', label: 'Em andamento' },
    { value: 'COMPLETED', label: 'Finalizado' },
    { value: 'CANCELLED', label: 'Cancelado' },
    { value: 'NO_SHOW', label: 'Não compareceu' }
  ]
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {appointment ? 'Editar Consulta' : 'Nova Consulta'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-4 p-3 text-sm font-medium text-white bg-red-500 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={e => {
                    setPatientSearchQuery(e.target.value)
                    setShowPatientSearch(true)
                    // Clear selected patient if search text changes
                    if (e.target.value !== formData.patientName) {
                      setFormData(prev => ({
                        ...prev,
                        patientId: '',
                        patientName: e.target.value
                      }))
                    }
                  }}
                  onClick={() => setShowPatientSearch(true)}
                  placeholder="Pesquisar paciente..."
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                
                {showPatientSearch && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto">
                    <ul className="py-1 text-base sm:text-sm">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map(patient => (
                          <li
                            key={patient.id}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                            onClick={() => selectPatient(patient)}
                          >
                            <div className="flex items-center">
                              <span className="font-normal block truncate">
                                {patient.name}
                              </span>
                            </div>
                            
                            {patient.id === formData.patientId && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-center py-2 text-gray-500">
                          Nenhum paciente encontrado
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="professionalId" className="block text-sm font-medium text-gray-700 mb-1">
                Profissional <span className="text-red-500">*</span>
              </label>
              <select
                id="professionalId"
                name="professionalId"
                value={formData.professionalId}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecione um profissional</option>
                {professionals.map(pro => (
                  <option key={pro.id} value={pro.id}>
                    {pro.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de início <span className="text-red-500">*</span>
                </label>
                <select
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de término <span className="text-red-500">*</span>
                </label>
                <select
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {timeSlots.filter(slot => slot > formData.startTime).map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Adicione informações relevantes sobre a consulta"
              />
            </div>
            
            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-1">
                Tratamento
              </label>
              <textarea
                id="treatment"
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                rows={3}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Descreva o tratamento aplicado ou planejado"
              />
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Salvando...' : appointment ? 'Atualizar' : 'Agendar'}
          </button>
        </div>
      </div>
    </div>
  )
} 