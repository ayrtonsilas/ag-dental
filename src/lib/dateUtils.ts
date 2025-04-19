import { format, parse, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formats a date string to a human-readable format (DD/MM/YYYY)
 * @param dateString The ISO date string to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return ''
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  
  if (!isValid(parsedDate)) return ''
  
  return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR })
}

/**
 * Formats a time string (HH:MM) to a human-readable format
 * @param timeString The time string to format (HH:MM)
 * @returns Formatted time string
 */
export function formatTime(date: Date | string | null): string {
  if (!date) return ''
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  
  if (!isValid(parsedDate)) return ''
  
  return format(parsedDate, 'HH:mm', { locale: ptBR })
}

/**
 * Returns date string in YYYY-MM-DD format for inputs
 * @param date Date to format
 * @returns YYYY-MM-DD formatted string
 */
export function getInputDateFormat(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Returns an array of dates for a given week
 * @param date Current date
 * @returns Array of dates for the week
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  
  const monday = new Date(date)
  monday.setDate(diff)
  
  const weekDates = []
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday)
    nextDate.setDate(monday.getDate() + i)
    weekDates.push(nextDate)
  }
  
  return weekDates
}

/**
 * Returns an array of dates for a given month
 * @param date Current date
 * @returns Array of dates for the month
 */
export function getMonthDates(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const firstDayOfWeek = firstDay.getDay()
  
  const firstCalendarDate = new Date(firstDay)
  firstCalendarDate.setDate(1 - (firstDayOfWeek === 0 ? 7 : firstDayOfWeek) + 1)
  
  const dates = []
  for (let i = 0; i < 42; i++) {
    const nextDate = new Date(firstCalendarDate)
    nextDate.setDate(firstCalendarDate.getDate() + i)
    dates.push(nextDate)
    
    if (nextDate > lastDay && nextDate.getDay() === 0) {
      break
    }
  }
  
  return dates
}

/**
 * Generate time slots for scheduling
 * @param startTime Start time (HH:MM)
 * @param endTime End time (HH:MM)
 * @param interval Interval in minutes
 * @returns Array of time slots
 */
export function generateTimeSlots(
  startTime: string = '08:00',
  endTime: string = '18:00',
  interval: number = 30
): string[] {
  const slots: string[] = []
  
  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const [endHours, endMinutes] = endTime.split(':').map(Number)
  
  const currentDate = new Date()
  currentDate.setHours(startHours, startMinutes, 0)
  
  const endDate = new Date()
  endDate.setHours(endHours, endMinutes, 0)
  
  while (currentDate <= endDate) {
    const hours = currentDate.getHours().toString().padStart(2, '0')
    const minutes = currentDate.getMinutes().toString().padStart(2, '0')
    slots.push(`${hours}:${minutes}`)
    
    currentDate.setMinutes(currentDate.getMinutes() + interval)
  }
  
  return slots
}

export function formatDateTime(date: Date | string | null): string {
  if (!date) return ''
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  
  if (!isValid(parsedDate)) return ''
  
  return format(parsedDate, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

export function parseDate(dateString: string): Date | null {
  if (!dateString) return null

  const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date())
  
  return isValid(parsedDate) ? parsedDate : null
}

export function parseDateTime(dateTimeString: string): Date | null {
  if (!dateTimeString) return null

  const [dateStr, timeStr] = dateTimeString.split(' ')
  
  if (!dateStr || !timeStr) return null
  
  const [day, month, year] = dateStr.split('/')
  const [hours, minutes] = timeStr.split(':')
  
  const parsedDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  )
  
  return isValid(parsedDate) ? parsedDate : null
}

export function getTimeSlots(
  startTime: string,
  endTime: string,
  duration: number
): string[] {
  const slots: string[] = []
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  const startDate = new Date()
  startDate.setHours(startHour, startMinute, 0)

  const endDate = new Date()
  endDate.setHours(endHour, endMinute, 0)

  const currentTime = new Date(startDate)

  while (currentTime <= endDate) {
    slots.push(format(currentTime, 'HH:mm'))
    currentTime.setMinutes(currentTime.getMinutes() + duration)
  }

  return slots
}

export function isTimeSlotAvailable(
  timeSlot: string,
  existingAppointments: { startTime: string }[]
): boolean {
  return !existingAppointments.some(
    appointment => appointment.startTime === timeSlot
  )
}

export function getAvailableTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
  existingAppointments: { startTime: string }[]
): string[] {
  const allTimeSlots = getTimeSlots(startTime, endTime, duration)
  return allTimeSlots.filter(slot =>
    isTimeSlotAvailable(slot, existingAppointments)
  )
}

export function getCurrentWeekDates(): {
  startDate: Date
  endDate: Date
} {
  const currentDate = new Date()
  const currentDay = currentDate.getDay()
  const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
  
  const startDate = new Date(currentDate.setDate(diff))
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)
  
  return { startDate, endDate }
} 