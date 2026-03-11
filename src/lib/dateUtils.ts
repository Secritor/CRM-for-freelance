export const formatDateInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getWeekKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getCurrentWeekStart = (): Date => {
  const now = new Date()
  const dayIndex = (now.getDay() + 6) % 7
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayIndex)
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

export const getCurrentWeekBounds = (): { weekStart: Date; weekEnd: Date } => {
  const now = new Date()
  const dayIndex = (now.getDay() + 6) % 7

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayIndex)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  return { weekStart, weekEnd }
}

export const isInCurrentWeek = (date: Date): boolean => {
  const { weekStart, weekEnd } = getCurrentWeekBounds()
  return date >= weekStart && date < weekEnd
}

export const parseDate = (date: Date | string): Date => {
  if (date instanceof Date) return date
  return new Date(date)
}

export const parseTimeFromDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const h = d.getHours()
  const m = d.getMinutes()
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export const formatDisplayDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
): string => {
  const d = parseDate(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', options)
}

export const getDaysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export const getYearsAgo = (years: number): Date => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - years)
  return date
}
