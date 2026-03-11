import React, { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '@/app/components-styles/Calendar.module.css'
import type { RootState } from '@/store/store'

const weekDays = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']

type ExtraEvent = {
  date: string | Date
}

type CalendarProps = {
  extraEvents?: ExtraEvent[]
  displayDate?: Date
  onDisplayDateChange?: (date: Date) => void
}

export default function Calendar({
  extraEvents = [],
  displayDate,
  onDisplayDateChange,
}: CalendarProps) {
  const [internalDate, setInternalDate] = useState(new Date())

  const events = useSelector((state: RootState) => state.events.events)

  const currentDate = displayDate ?? internalDate

  const setCurrentDate = useCallback(
    (date: Date) => {
      if (onDisplayDateChange) {
        onDisplayDateChange(date)
      } else {
        setInternalDate(date)
      }
    },
    [onDisplayDateChange]
  )

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const { days, eventsByDay } = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7
    const daysInMonth = lastDayOfMonth.getDate()

    const computedDays: (number | null)[] = []

    for (let i = 0; i < startDayIndex; i++) {
      computedDays.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      computedDays.push(i)
    }

    const eventsSet = new Set<number>()

    const allEventDates = [
      ...events.map(event => event.date),
      ...extraEvents.map(event => event.date),
    ]

    for (const rawDate of allEventDates) {
      let eventDate: Date | null = null

      if (rawDate instanceof Date) {
        eventDate = rawDate
      } else if (typeof rawDate === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
          const [y, m, d] = rawDate.split('-').map(Number)
          eventDate = new Date(y, m - 1, d)
        } else {
          eventDate = new Date(rawDate)
        }
      }

      if (!eventDate || Number.isNaN(eventDate.getTime())) continue

      if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        eventsSet.add(eventDate.getDate())
      }
    }

    return { days: computedDays, eventsByDay: eventsSet }
  }, [year, month, events, extraEvents])

  const hasEvent = useCallback((day: number) => eventsByDay.has(day), [eventsByDay])

  const prevMonth = useCallback(
    () => setCurrentDate(new Date(year, month - 1, 1)),
    [year, month, setCurrentDate]
  )

  const nextMonth = useCallback(
    () => setCurrentDate(new Date(year, month + 1, 1)),
    [year, month, setCurrentDate]
  )

  return (
    <div className={styles.calendar_wrapper}>
      <div className={styles.calendar_header}>
        <button onClick={prevMonth}>◀</button>
        <div className={styles.month_title}>
          {currentDate.toLocaleString('en-EN', {
            month: 'short',
            year: 'numeric',
          })}
        </div>
        <button onClick={nextMonth}>▶</button>
      </div>

      <div className={styles.calendar_grid}>
        {weekDays.map(day => (
          <div key={day} className={styles.week_day}>
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const eventExists = day !== null && hasEvent(day)

          return (
            <div
              key={index}
              className={`${styles.calendar_cell} ${eventExists ? styles.has_event : ''}`}
            >
              {day}

              {eventExists && <span className={styles.event_marker} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
