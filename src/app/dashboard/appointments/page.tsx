'use client'

import { useState, useEffect } from 'react'
import { Appointment, AppointmentStatus } from '@/types'
import AppointmentCalendar from '@/components/appointments/FullCalendar'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patients, setPatients] = useState<{ id: string, name: string }[]>([])
  const [professionals, setProfessionals] = useState<{ id: string, name: string }[]>([])
  const [calendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek')
  const [formData, setFormData] = useState({
    patientId: '',
    professionalId: '',
    date: selectedDate,
    startTime: '09:00',
    endTime: '09:30',
    status: 'SCHEDULED' as AppointmentStatus,
    notes: '',
    treatment: ''
  })
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])

  // Load appointments on mount
  useEffect(() => {
    fetchAppointments()
    fetchPatients()
    fetchProfessionals()
  }, [selectedDate])
  
  // Load appointments and calculate available time slots when date or professional changes
  useEffect(() => {
    if (selectedDate) {
      fetchAppointments()
    }
  }, [selectedDate])

  // Calculate available time slots when appointments change
  useEffect(() => {
    if (appointments.length > 0 && formData.professionalId) {
      calculateAvailableTimeSlots()
    } else if (formData.professionalId) {
      // If no appointments but we have a professional selected, show all time slots
      setAvailableTimeSlots(generateTimeSlots())
    } else {
      setAvailableTimeSlots([])
    }
  }, [appointments, formData.professionalId])

  // Update form date when selected date changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, date: selectedDate }))
  }, [selectedDate])

  // Update available time slots when professional changes
  useEffect(() => {
    if (formData.professionalId) {
      calculateAvailableTimeSlots()
    } else {
      setAvailableTimeSlots([])
    }
  }, [formData.professionalId])
  
  // Fetch appointments for the selected date
  const fetchAppointments = async () => {
    try {
      // Construct the query params
      const params = new URLSearchParams()
      const startDate = new Date(selectedDate)
      startDate.setDate(startDate.getDate() - 7) // Get appointments from 7 days before
      const endDate = new Date(selectedDate)
      endDate.setDate(endDate.getDate() + 7) // Get appointments up to 7 days after
      
      params.append('startDate', startDate.toISOString().split('T')[0])
      params.append('endDate', endDate.toISOString().split('T')[0])
      params.append('pageSize', '100') // Increase page size to show more appointments
      
      // Attempt to fetch from the API
      try {
        const response = await fetch(`/api/appointments?${params.toString()}`)
        
        if (response.ok) {
          const data = await response.json()
          setAppointments(data.appointments || [])
          return
        }
      } catch (apiError) {
        console.error('Error fetching from API:', apiError)
        throw apiError // Don't fall back to mock data, let the error be visible
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setError('Erro ao carregar consultas. Por favor, tente novamente.')
    }
  }
  
  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients?pageSize=100')
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients')
      }
      
      const data = await response.json()
      setPatients(data.patients.map((patient: { id: string; name: string }) => ({
        id: patient.id,
        name: patient.name
      })))
    } catch (error) {
      console.error('Error fetching patients, falling back to mock data:', error)
      
      // Fallback to mock data
      setPatients([
        { id: 'patient1', name: 'João Silva' },
        { id: 'patient2', name: 'Ana Oliveira' },
        { id: 'patient3', name: 'Carlos Souza' },
        { id: 'patient4', name: 'Mariana Costa' }
      ])
    }
  }
  
  // Fetch professionals
  const fetchProfessionals = async () => {
    try {
      const response = await fetch('/api/professionals?pageSize=100')
      
      if (!response.ok) {
        throw new Error('Failed to fetch professionals')
      }
      
      const data = await response.json()
      setProfessionals(data.professionals.map((professional: { id: string; name: string }) => ({
        id: professional.id,
        name: professional.name
      })))
    } catch (error) {
      console.error('Error fetching professionals, falling back to mock data:', error)
      
      // Fallback to mock data
      setProfessionals([
        { id: 'professional1', name: 'Dra. Maria Santos' },
        { id: 'professional2', name: 'Dr. Carlos Mendes' },
        { id: 'professional3', name: 'Dra. Patricia Lima' }
      ])
    }
  }
  
  // Helper to get color based on appointment status
  const getStatusColor = (status: AppointmentStatus): string => {
    switch (status) {
      case 'SCHEDULED':
        return '#3B82F6' // blue-500
      case 'CONFIRMED':
        return '#10B981' // green-500
      case 'IN_PROGRESS':
        return '#FBBF24' // yellow-400
      case 'COMPLETED':
        return '#8B5CF6' // violet-500
      case 'CANCELLED':
        return '#EF4444' // red-500
      case 'NO_SHOW':
        return '#6B7280' // gray-500
      default:
        return '#6B7280' // gray-500
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      // If start time changes, ensure end time is after it
      if (name === 'startTime' && value && newData.endTime && value >= newData.endTime) {
        // Find the next available time slot
        const startIndex = availableTimeSlots.indexOf(value)
        if (startIndex !== -1 && startIndex < availableTimeSlots.length - 1) {
          newData.endTime = availableTimeSlots[startIndex + 1]
        }
      }
      
      // If end time changes, ensure it's after start time
      if (name === 'endTime' && value && newData.startTime && value <= newData.startTime) {
        // Find the next available time slot after start time
        const startIndex = availableTimeSlots.indexOf(newData.startTime)
        if (startIndex !== -1 && startIndex < availableTimeSlots.length - 1) {
          newData.endTime = availableTimeSlots[startIndex + 1]
        }
      }
      
      return newData
    })
    
    // Recalculate available time slots when professional changes
    if (name === 'professionalId') {
      if (value) {
        calculateAvailableTimeSlots()
      } else {
        setAvailableTimeSlots([])
      }
    }
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
      
      let result: Appointment | null = null
      
      // Try to submit to the API
      try {
        const url = selectedAppointment 
          ? `/api/appointments?id=${selectedAppointment.id}` 
          : '/api/appointments'
          
        const method = selectedAppointment ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          if (response.status === 409) {
            throw new Error(errorData.error)
          }
          throw new Error(errorData.error || `Failed to ${selectedAppointment ? 'update' : 'create'} appointment`)
        }
        
        const data = await response.json()
        result = data.appointment
      } catch (apiError) {
        console.error('API error:', apiError)
        throw apiError
      }
      
      // Update the appointments list
      if (selectedAppointment) {
        setAppointments(prev => 
          prev.map(app => app.id === selectedAppointment.id ? result! : app)
        )
      } else {
        setAppointments(prev => [...prev, result!])
      }
      
      // Reset form and close modal
      setFormData({
        patientId: '',
        professionalId: '',
        date: selectedDate,
        startTime: '09:00',
        endTime: '09:30',
        status: 'SCHEDULED' as AppointmentStatus,
        notes: '',
        treatment: ''
      })
      setSelectedAppointment(null)
      setShowModal(false)
      setIsSubmitting(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar consulta')
      setIsSubmitting(false)
    }
  }
  
  // Generate time slots from 8:00 to 18:00 with 30min intervals
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  // Calculate available time slots based on existing appointments
  const calculateAvailableTimeSlots = () => {
    const allSlots = generateTimeSlots()
    const bookedSlots = new Set()

    // Get appointments for the selected professional on the selected date
    const professionalAppointments = appointments.filter(
      app => app.professionalId === formData.professionalId && 
             app.date === selectedDate &&
             // Exclude the current appointment if we're editing
             (!selectedAppointment || app.id !== selectedAppointment.id)
    )

    // Mark booked time slots
    professionalAppointments.forEach(app => {
      if (app.status !== 'CANCELLED' && app.status !== 'NO_SHOW') {
        const startTime = app.startTime
        const endTime = app.endTime
        
        // Convert times to minutes for easier comparison
        const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1])
        const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1])
        
        // Mark all slots between start and end time as booked
        for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
          const hour = Math.floor(minutes / 60)
          const minute = minutes % 60
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          bookedSlots.add(time)
        }
      }
    })

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.has(slot))
    setAvailableTimeSlots(availableSlots)
  }
  
  // Handle calendar appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setFormData({
      patientId: appointment.patientId,
      professionalId: appointment.professionalId,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      notes: appointment.notes || '',
      treatment: appointment.treatment || ''
    })
    setShowModal(true)
    // Recalculate available time slots after setting the form data
    calculateAvailableTimeSlots()
  }
  
  // Handle creating appointment from calendar click
  const handleCalendarAddClick = (date: string, hour: string) => {
    setSelectedDate(date)
    setSelectedAppointment(null)
    setFormData({
      patientId: '',
      professionalId: '',
      date: date,
      startTime: hour,
      endTime: '', // Will be set by handleChange when startTime is selected
      status: 'SCHEDULED' as AppointmentStatus,
      notes: '',
      treatment: ''
    })
    setShowModal(true)
  }
  
  // Handle deleting an appointment
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment || !confirm('Tem certeza que deseja excluir esta consulta?')) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Try to delete from API
      try {
        const response = await fetch(`/api/appointments?id=${selectedAppointment.id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete appointment')
        }
      } catch (apiError) {
        console.error('API error during deletion:', apiError)
        // Continue with UI update even if API call fails
      }
      
      // Update the UI by removing the appointment
      setAppointments(prev => prev.filter(app => app.id !== selectedAppointment.id))
      setShowModal(false)
      setSelectedAppointment(null)
    } catch (error) {
      console.error('Error deleting appointment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Consultas</h1>
        
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Nova Consulta
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <AppointmentCalendar
          appointments={appointments}
          onEventClick={handleAppointmentClick}
          onDateSelect={setSelectedDate}
          onAddClick={handleCalendarAddClick}
          getStatusColor={getStatusColor}
          view={calendarView}
          date={selectedDate}
        />
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedAppointment ? 'Editar Consulta' : 'Nova Consulta'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 text-sm font-medium text-white bg-red-500 rounded-lg">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Paciente <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um paciente</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profissional <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="professionalId"
                    value={formData.professionalId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um profissional</option>
                    {professionals.map(pro => (
                      <option key={pro.id} value={pro.id}>{pro.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Data <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário de Início
                    </label>
                    <select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecione um horário</option>
                      {availableTimeSlots.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário de Término
                    </label>
                    <select
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecione um horário</option>
                      {availableTimeSlots
                        .filter(time => !formData.startTime || time > formData.startTime)
                        .map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SCHEDULED">Agendado</option>
                    <option value="CONFIRMED">Confirmado</option>
                    <option value="IN_PROGRESS">Em andamento</option>
                    <option value="COMPLETED">Finalizado</option>
                    <option value="CANCELLED">Cancelado</option>
                    <option value="NO_SHOW">Não compareceu</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    rows={3}
                    placeholder="Observações sobre a consulta..."
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tratamento
                  </label>
                  <textarea 
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    rows={3}
                    placeholder="Detalhes do tratamento..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  {selectedAppointment && (
                    <button
                      type="button"
                      onClick={handleDeleteAppointment}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Excluir
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Salvando...' : selectedAppointment ? 'Atualizar Consulta' : 'Agendar Consulta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 