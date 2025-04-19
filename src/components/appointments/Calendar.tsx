'use client'

import { useState, useEffect } from 'react'
import { Appointment, AppointmentStatus } from '@/types'
import {
  getWeekDates,
  getMonthDates,
  formatTime,
  getInputDateFormat
} from '@/lib/dateUtils'

interface CalendarProps {
  appointments: Appointment[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  view: 'day' | 'week' | 'month'
  onViewChange: (view: 'day' | 'week' | 'month') => void
  onSelectAppointment: (appointment: Appointment) => void
  onCreateAppointment: () => void
  getStatusColor: (status: AppointmentStatus) => string
  isLoading: boolean
  statusLabels: Record<AppointmentStatus, string>
}

export default function Calendar({
  appointments,
  selectedDate,
  onDateChange,
  view,
  onViewChange,
  onSelectAppointment,
  onCreateAppointment,
  getStatusColor,
  isLoading,
  statusLabels
}: CalendarProps) {
  const [displayDates, setDisplayDates] = useState<Date[]>([])
  
  // Update displayed dates based on view and selected date
  useEffect(() => {
    if (view === 'day') {
      setDisplayDates([selectedDate])
    } else if (view === 'week') {
      setDisplayDates(getWeekDates(selectedDate))
    } else {
      setDisplayDates(getMonthDates(selectedDate))
    }
  }, [view, selectedDate])
  
  // Generate time slots for day view (8:00 to 18:00 with 30min intervals)
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = i % 2 === 0 ? '00' : '30'
    return `${hour.toString().padStart(2, '0')}:${minute}`
  })
  
  // Helper to get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateString = getInputDateFormat(date)
    return appointments.filter(a => a.date === dateString)
  }
  
  // Navigation helpers
  const navigatePrevious = () => {
    const newDate = new Date(selectedDate)
    
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    
    onDateChange(newDate)
  }
  
  const navigateNext = () => {
    const newDate = new Date(selectedDate)
    
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    
    onDateChange(newDate)
  }
  
  const navigateToday = () => {
    onDateChange(new Date())
  }
  
  // Format date for display
  const formatHeaderTitle = () => {
    if (view === 'day') {
      return selectedDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } else if (view === 'week') {
      const start = displayDates[0]
      const end = displayDates[displayDates.length - 1]
      return `${start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`
    } else {
      return selectedDate.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
      })
    }
  }
  
  // Render day view
  const renderDayView = () => {
    return (
      <div className="min-w-full divide-y divide-gray-200">
        <div className="grid grid-cols-1 gap-2 p-4">
          {timeSlots.map(time => {
            const appointmentsAtTime = appointments.filter(a => {
              return a.date === getInputDateFormat(selectedDate) && a.startTime <= time && a.endTime > time
            })
            
            return (
              <div 
                key={time} 
                className="min-h-[60px] flex items-start gap-2 border-t border-gray-100 py-1"
              >
                <div className="w-16 text-sm font-medium text-gray-600 py-1">
                  {time}
                </div>
                <div className="flex-grow grid grid-cols-1 gap-1">
                  {appointmentsAtTime.length === 0 ? (
                    <div 
                      className="min-h-[60px] bg-gray-50 border border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition flex items-center justify-center"
                      onClick={() => onCreateAppointment()}
                    >
                      <span className="text-xs text-gray-400">+ Nova consulta</span>
                    </div>
                  ) : (
                    appointmentsAtTime.map(appointment => (
                      <div 
                        key={appointment.id}
                        className={`p-2 rounded-lg border ${getStatusColor(appointment.status)} cursor-pointer transition hover:opacity-90`}
                        onClick={() => onSelectAppointment(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">
                            {appointment.patient?.name}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-white bg-opacity-50">
                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                          </span>
                        </div>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-xs">
                            {appointment.professional?.name}
                          </span>
                          <span className="text-xs">
                            {statusLabels[appointment.status]}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  // Render week view
  const renderWeekView = () => {
    return (
      <div className="min-w-full divide-y divide-gray-200">
        <div className="grid grid-cols-7 divide-x divide-gray-200">
          {displayDates.map((date, index) => {
            const isToday = new Date().toDateString() === date.toDateString()
            const isSelected = selectedDate.toDateString() === date.toDateString()
            
            return (
              <div 
                key={index}
                className={`p-2 ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'bg-blue-100' : ''}`}
              >
                <div 
                  className="text-center cursor-pointer"
                  onClick={() => onDateChange(date)}
                >
                  <p className="text-sm font-medium">
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <p className={`text-2xl ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                    {date.getDate()}
                  </p>
                </div>
                
                <div className="mt-2 space-y-1 max-h-[500px] overflow-y-auto">
                  {getAppointmentsForDate(date).length === 0 ? (
                    <div 
                      className="h-12 bg-gray-50 border border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition flex items-center justify-center"
                      onClick={() => {
                        onDateChange(date)
                        onCreateAppointment()
                      }}
                    >
                      <span className="text-xs text-gray-400">+ Nova consulta</span>
                    </div>
                  ) : (
                    getAppointmentsForDate(date).map(appointment => (
                      <div 
                        key={appointment.id}
                        className={`p-2 rounded-lg border ${getStatusColor(appointment.status)} cursor-pointer transition hover:opacity-90`}
                        onClick={() => onSelectAppointment(appointment)}
                      >
                        <div className="font-medium text-sm truncate">
                          {appointment.patient?.name}
                        </div>
                        <div className="text-xs mt-1 flex justify-between">
                          <span>
                            {formatTime(appointment.startTime)}
                          </span>
                          <span>
                            {statusLabels[appointment.status]}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  // Render month view
  const renderMonthView = () => {
    const currentMonth = selectedDate.getMonth()
    
    return (
      <div className="min-w-full divide-y divide-gray-200">
        <div className="grid grid-cols-7 divide-x divide-gray-200">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="p-2 bg-gray-50 text-center">
              <p className="text-xs font-medium text-gray-700">{day}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 divide-x divide-gray-200 divide-y">
          {displayDates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth
            const isToday = new Date().toDateString() === date.toDateString()
            const isSelected = selectedDate.toDateString() === date.toDateString()
            const dateAppointments = getAppointmentsForDate(date)
            
            return (
              <div 
                key={index}
                className={`min-h-[100px] p-1 ${!isCurrentMonth ? 'bg-gray-50' : ''} ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'bg-blue-100' : ''}`}
              >
                <div 
                  className="text-right cursor-pointer"
                  onClick={() => {
                    onDateChange(date)
                    onViewChange('day')
                  }}
                >
                  <p className={`inline-block rounded-full w-6 h-6 flex items-center justify-center ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'} text-sm`}>
                    {date.getDate()}
                  </p>
                </div>
                
                <div className="mt-1 text-xs">
                  {dateAppointments.length > 0 ? (
                    <>
                      {dateAppointments.slice(0, 3).map(appointment => (
                        <div 
                          key={appointment.id}
                          className={`p-1 my-1 rounded border-l-4 ${getStatusColor(appointment.status)} cursor-pointer transition hover:opacity-90 truncate`}
                          onClick={() => onSelectAppointment(appointment)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate" style={{ maxWidth: '60%' }}>
                              {appointment.patient?.name}
                            </span>
                            <span className="whitespace-nowrap">
                              {formatTime(appointment.startTime)}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {dateAppointments.length > 3 && (
                        <div 
                          className="text-xs text-center text-blue-600 cursor-pointer hover:underline"
                          onClick={() => {
                            onDateChange(date)
                            onViewChange('day')
                          }}
                        >
                          + {dateAppointments.length - 3} mais
                        </div>
                      )}
                    </>
                  ) : isCurrentMonth ? (
                    <div 
                      className="h-6 mt-2 border border-dashed border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition flex items-center justify-center opacity-60"
                      onClick={() => {
                        onDateChange(date)
                        onCreateAppointment()
                      }}
                    >
                      <span className="text-xs text-gray-400">+</span>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white border rounded-lg shadow overflow-hidden">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex flex-col md:flex-row justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{formatHeaderTitle()}</h3>
        
        <div className="mt-3 md:mt-0 flex space-x-3">
          <button
            type="button"
            onClick={navigateToday}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Hoje
          </button>
          
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={navigatePrevious}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <span className="sr-only">Anterior</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={navigateNext}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <span className="sr-only">Próximo</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-auto border-t border-gray-200">
        {isLoading ? (
          <div className="py-10 text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Carregando consultas...</p>
          </div>
        ) : (
          <>
            {view === 'day' && renderDayView()}
            {view === 'week' && renderWeekView()}
            {view === 'month' && renderMonthView()}
          </>
        )}
      </div>
    </div>
  )
} 