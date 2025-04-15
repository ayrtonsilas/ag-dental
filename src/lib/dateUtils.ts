/**
 * Formats a date string to a human-readable format (DD/MM/YYYY)
 * @param dateString The ISO date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formats a time string (HH:MM) to a human-readable format
 * @param timeString The time string to format (HH:MM)
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  
  // If it's already in HH:MM format, just return it
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
    // Return only HH:MM if it contains seconds
    return timeString.substring(0, 5);
  }
  
  // If it's an ISO date with time
  if (timeString.includes('T')) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  
  return timeString;
}

/**
 * Returns date string in YYYY-MM-DD format for inputs
 * @param date Date to format
 * @returns YYYY-MM-DD formatted string
 */
export function getInputDateFormat(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Returns an array of dates for a given week
 * @param date Current date
 * @returns Array of dates for the week
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday as first day
  
  const monday = new Date(date);
  monday.setDate(diff);
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }
  
  return weekDates;
}

/**
 * Returns an array of dates for a given month
 * @param date Current date
 * @returns Array of dates for the month
 */
export function getMonthDates(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // First day of month
  const firstDay = new Date(year, month, 1);
  // Last day of month
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the first day of the week of the month
  const firstDayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
  
  // Calculate first calendar date (may be in previous month)
  const firstCalendarDate = new Date(firstDay);
  firstCalendarDate.setDate(1 - (firstDayOfWeek === 0 ? 7 : firstDayOfWeek) + 1); // Adjust for Monday as first day
  
  const dates = [];
  // Generate 42 dates (6 weeks) to ensure we cover the whole month plus paddings
  for (let i = 0; i < 42; i++) {
    const nextDate = new Date(firstCalendarDate);
    nextDate.setDate(firstCalendarDate.getDate() + i);
    dates.push(nextDate);
    
    // Break if we've gone past the last day of the month and completed the week
    if (nextDate > lastDay && nextDate.getDay() === 0) {
      break;
    }
  }
  
  return dates;
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
  const slots: string[] = [];
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let currentDate = new Date();
  currentDate.setHours(startHours, startMinutes, 0);
  
  const endDate = new Date();
  endDate.setHours(endHours, endMinutes, 0);
  
  while (currentDate <= endDate) {
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    
    currentDate.setMinutes(currentDate.getMinutes() + interval);
  }
  
  return slots;
} 