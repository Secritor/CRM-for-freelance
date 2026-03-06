'use client'

import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Title from './Title'
import Calendar from './Calendar'
import TaskBoard, { BoardState, createEmptyBoard, dayColumns } from './TaskBoard'
import styles from '../calendar/calendar.module.css'
import {
  updateBoard,
  setWeekStart,
  setCalendarDisplayDate,
  getWeekKeyHelper,
} from '@/features/calendar/calendarSlice'
import type { RootState } from '@/store/store'

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(date.getDate() + days)
  next.setHours(0, 0, 0, 0)
  return next
}

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`

const parseDateKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export default function CalendarPageClient() {
  const dispatch = useDispatch()
  const {
    weekBoards,
    weekStart: weekStartKey,
    calendarDisplayDate: calendarDisplayKey,
  } = useSelector((state: RootState) => state.calendar)

  const weekStart = useMemo(() => parseDateKey(weekStartKey), [weekStartKey])
  const calendarDisplayDate = useMemo(() => parseDateKey(calendarDisplayKey), [calendarDisplayKey])

  const weekKey = weekStartKey
  const board = useMemo(() => weekBoards[weekKey] ?? createEmptyBoard(), [weekBoards, weekKey])

  const extraEvents = useMemo(() => {
    const dates: { date: string }[] = []

    Object.entries(weekBoards).forEach(([key, weekBoard]) => {
      const weekStartDate = parseDateKey(key)

      dayColumns.forEach((day, index) => {
        const tasks = weekBoard[day]
        if (!tasks || tasks.length === 0) return

        const date = addDays(weekStartDate, index)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const dayNumber = String(date.getDate()).padStart(2, '0')

        dates.push({ date: `${year}-${month}-${dayNumber}` })
      })
    })

    return dates
  }, [weekBoards])

  const handleBoardChange = useCallback(
    (updater: (prev: BoardState) => BoardState) => {
      const currentBoard = board
      const nextBoard = updater(currentBoard)
      dispatch(updateBoard({ weekKey, board: nextBoard }))
    },
    [dispatch, weekKey, board]
  )

  const handleWeekChange = useCallback(
    (direction: 'prev' | 'next') => {
      const nextWeekStart = addDays(weekStart, direction === 'next' ? 7 : -7)
      const nextWeekKey = getWeekKeyHelper(nextWeekStart)

      const currentMonth = getMonthKey(calendarDisplayDate)
      const weekDates = Array.from({ length: 7 }, (_, i) => addDays(nextWeekStart, i))
      const outOfMonthDates = weekDates.filter(d => getMonthKey(d) !== currentMonth)

      if (outOfMonthDates.length > 0) {
        const targetDate =
          direction === 'next' ? outOfMonthDates[0] : outOfMonthDates[outOfMonthDates.length - 1]
        dispatch(setCalendarDisplayDate(getWeekKeyHelper(targetDate)))
      }

      dispatch(setWeekStart(nextWeekKey))
    },
    [dispatch, weekStart, calendarDisplayDate]
  )

  const handleDisplayDateChange = useCallback(
    (date: Date) => {
      dispatch(setCalendarDisplayDate(getWeekKeyHelper(date)))
    },
    [dispatch]
  )

  return (
    <div className={styles.container}>
      <Title titleText="Calendar" subtitleText="Manage your activities" />
      {/* <div className={styles.calendar_wrapper}> */}
      <Calendar
        extraEvents={extraEvents}
        displayDate={calendarDisplayDate}
        onDisplayDateChange={handleDisplayDateChange}
      />
      <TaskBoard
        weekStart={weekStart}
        board={board}
        onBoardChange={handleBoardChange}
        onWeekChange={handleWeekChange}
      />
      {/* </div> */}
    </div>
  )
}
