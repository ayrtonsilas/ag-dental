'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { Appointment, AppointmentStatus } from '@/types'
import { EventClickArg, DateSelectArg } from '@fullcalendar/core'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    appointment: Appointment
  }
}

interface AppointmentCalendarProps {
  appointments: Appointment[]
  onEventClick: (appointment: Appointment) => void
  onDateSelect: (startStr: string) => void
  onAddClick: (date: string, hour: string) => void
  getStatusColor: (status: AppointmentStatus) => string
  view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
  date: string
}

export default function AppointmentCalendar({
  appointments,
  onEventClick,
  onDateSelect,
  onAddClick,
  getStatusColor,
  view,
  date
}: AppointmentCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  
  // Format appointments as calendar events
  useEffect(() => {
    const formattedEvents = appointments.map(appointment => {
      const startDateTime = `${appointment.date}T${appointment.startTime}:00`
      const endDateTime = `${appointment.date}T${appointment.endTime}:00`
      const statusColor = getStatusColor(appointment.status)
      
      return {
        id: appointment.id,
        title: `${appointment.patient?.name} - ${appointment.professional?.name}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: statusColor,
        borderColor: statusColor,
        textColor: '#ffffff',
        extendedProps: {
          appointment
        }
      }
    })
    
    setEvents(formattedEvents)
  }, [appointments, getStatusColor])
  
  const handleEventClick = (info: EventClickArg) => {
    const appointment = info.event.extendedProps.appointment as Appointment
    onEventClick(appointment)
  }
  
  const handleDateSelect = (info: DateSelectArg) => {
    onDateSelect(info.startStr.split('T')[0])
  }
  
  const handleDateClick = (info: DateClickArg) => {
    const date = info.dateStr.split('T')[0]
    const hour = info.dateStr.split('T')[1]?.substring(0, 5) || '09:00'
    onAddClick(date, hour)
  }
  
  return (
    <div className="h-[700px]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        initialDate={date}
        locale={ptBrLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia'
        }}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        selectable={true}
        select={handleDateSelect}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00"
        slotDuration="00:30:00"
        height="100%"
        stickyHeaderDates={true}
        nowIndicator={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
      />
    </div>
  )
} 