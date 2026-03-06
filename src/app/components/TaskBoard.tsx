'use client'

import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './TaskBoard.module.css'
import UniversalModal from './UniversalModal'
import type { FieldConfig } from '@/interfaces/main'
import { formatDateInput } from '@/lib/dateUtils'
import { addEvent, updateEvent, deleteEvent } from '@/features/events/eventsSlice'
import type { EventType } from '@/interfaces/main'
import type { RootState } from '@/store/store'

export const dayColumns = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'] as const

export type DayColumnId = (typeof dayColumns)[number]

export type TaskType = 'task' | 'meeting'

export type Task = {
  id: string
  title: string
  type: TaskType
  eventId?: number
  description?: string
}

export type BoardState = Record<DayColumnId, Task[]>

export const createEmptyBoard = (): BoardState => ({
  Mon: [],
  Tues: [],
  Wed: [],
  Thurs: [],
  Fri: [],
  Sat: [],
  Sun: [],
})

type TaskBoardProps = {
  weekStart: Date
  board: BoardState
  onBoardChange: (updater: (prev: BoardState) => BoardState) => void
  onWeekChange: (direction: 'prev' | 'next') => void
}

const formatDayMonth = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })

const parseTimeFromDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function TaskBoard({
  weekStart,
  board,
  onBoardChange,
  onWeekChange,
}: TaskBoardProps) {
  const dispatch = useDispatch()
  const events = useSelector((state: RootState) => state.events.events)

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDay, setNewTaskDay] = useState<DayColumnId>('Mon')
  const [newTaskType, setNewTaskType] = useState<TaskType>('task')
  const [dragInfo, setDragInfo] = useState<{
    fromColumn: DayColumnId
    taskId: string
  } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'createMeeting' | 'editTask' | 'editMeeting'>(
    'createMeeting'
  )
  const [modalContext, setModalContext] = useState<{
    columnId: DayColumnId
    task?: Task
    meetingDate?: Date
    meetingColumn?: DayColumnId
  } | null>(null)

  const updateBoard = useCallback(
    (updater: (prev: BoardState) => BoardState) => {
      onBoardChange(updater)
    },
    [onBoardChange]
  )

  const handleAddTask = useCallback(() => {
    const title = newTaskTitle.trim()

    if (!title) return

    if (newTaskType === 'meeting') {
      const columnIndex = dayColumns.indexOf(newTaskDay)
      const targetDate = new Date(weekStart)
      targetDate.setDate(weekStart.getDate() + columnIndex)
      targetDate.setHours(0, 0, 0, 0)

      setModalMode('createMeeting')
      setModalContext({ columnId: newTaskDay, meetingDate: targetDate, meetingColumn: newTaskDay })
      setModalOpen(true)
      return
    }

    updateBoard(prev => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const task: Task = { id, title, type: 'task' }

      return {
        ...prev,
        [newTaskDay]: [...prev[newTaskDay], task],
      }
    })

    setNewTaskTitle('')
  }, [newTaskDay, newTaskTitle, newTaskType, updateBoard, weekStart])

  const handleDeleteTask = useCallback(
    (columnId: DayColumnId, task: Task) => {
      if (task.type === 'meeting' && task.eventId) {
        dispatch(deleteEvent(task.eventId))
      }
      updateBoard(prev => ({
        ...prev,
        [columnId]: prev[columnId].filter(t => t.id !== task.id),
      }))
    },
    [dispatch, updateBoard]
  )

  const handleEditTask = useCallback((columnId: DayColumnId, task: Task) => {
    setModalMode(task.type === 'meeting' ? 'editMeeting' : 'editTask')
    setModalContext({ columnId, task })
    setModalOpen(true)
  }, [])

  const handleDragStart = useCallback((fromColumn: DayColumnId, taskId: string) => {
    setDragInfo({ fromColumn, taskId })
  }, [])

  const handleDrop = useCallback(
    (toColumn: DayColumnId) => {
      if (!dragInfo) return

      updateBoard(prev => {
        const { fromColumn, taskId } = dragInfo
        if (fromColumn === toColumn) {
          return prev
        }

        const taskToMove = prev[fromColumn].find(task => task.id === taskId)
        if (!taskToMove) return prev

        return {
          ...prev,
          [fromColumn]: prev[fromColumn].filter(task => task.id !== taskId),
          [toColumn]: [...prev[toColumn], taskToMove],
        }
      })

      setDragInfo(null)
    },
    [dragInfo, updateBoard]
  )

  const allowDrop: React.DragEventHandler<HTMLDivElement> = event => {
    event.preventDefault()
  }

  return (
    <>
      <div className={styles.boardWrapper}>
        <div className={styles.boardHeader}>
          <div>
            <div className={styles.boardTitle}>Tasks</div>
            <div className={styles.boardSubtitle}>Lightweight day-by-day task board</div>
          </div>

          <div className={styles.weekNav}>
            <button type="button" className={styles.navButton} onClick={() => onWeekChange('prev')}>
              ◀ Week
            </button>

            <div className={styles.weekRange}>
              {formatDayMonth(weekStart)} –{' '}
              {formatDayMonth(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}
            </div>

            <button type="button" className={styles.navButton} onClick={() => onWeekChange('next')}>
              Week ▶
            </button>
          </div>
        </div>

        <div className={styles.taskForm}>
          <input
            className={styles.taskInput}
            type="text"
            placeholder="Add a task..."
            value={newTaskTitle}
            onChange={event => setNewTaskTitle(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAddTask()
              }
            }}
          />

          <select
            className={styles.daySelect}
            value={newTaskDay}
            onChange={event => setNewTaskDay(event.target.value as DayColumnId)}
          >
            {dayColumns.map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <select
            className={styles.daySelect}
            value={newTaskType}
            onChange={event => setNewTaskType(event.target.value as TaskType)}
          >
            <option value="task">Task</option>
            <option value="meeting">Meeting</option>
          </select>

          <button type="button" className={styles.addButton} onClick={handleAddTask}>
            Add
          </button>
        </div>

        <div className={styles.columnsWrapper}>
          <div className={styles.columns}>
            {dayColumns.map((columnId, index) => {
            const tasks = board[columnId]
            const date = new Date(weekStart)
            date.setDate(weekStart.getDate() + index)

            return (
              <div
                key={columnId}
                className={styles.column}
                onDragOver={allowDrop}
                onDrop={() => handleDrop(columnId)}
              >
                <div className={styles.columnHeader}>{columnId}</div>
                <div className={styles.columnDate}>{formatDayMonth(date)}</div>

                <div className={styles.tasksList}>
                  {tasks.length === 0 ? (
                    <div className={styles.emptyColumn}>No tasks</div>
                  ) : (
                    tasks.map(task => (
                      <div
                        key={task.id}
                        className={styles.taskCard}
                        draggable
                        onDragStart={() => handleDragStart(columnId, task.id)}
                      >
                        <div className={styles.taskTitle}>{task.title}</div>

                        <div className={styles.taskActions}>
                          <button
                            type="button"
                            className={styles.taskActionButton}
                            onClick={() => handleEditTask(columnId, task)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className={`${styles.taskActionButton} ${styles.deleteButton}`}
                            onClick={() => handleDeleteTask(columnId, task)}
                          >
                            Delete
                          </button>
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
      </div>

      <UniversalModal
        open={modalOpen}
        title={
          modalMode === 'editTask'
            ? 'Edit task'
            : modalMode === 'createMeeting'
              ? 'Create meeting'
              : 'Edit meeting'
        }
        description={modalMode === 'editTask' ? 'Update task details' : 'Configure meeting details'}
        submitText={
          modalMode === 'editTask'
            ? 'Save task'
            : modalMode === 'createMeeting'
              ? 'Create meeting'
              : 'Save meeting'
        }
        fields={(() => {
          const isTaskMode = modalMode === 'editTask'
          const fields: FieldConfig[] = [
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              placeholder: isTaskMode ? 'Task title' : 'Meeting title',
            },
          ]
          if (!isTaskMode) {
            fields.push(
              { name: 'date', label: 'Date', type: 'date', required: true },
              { name: 'time', label: 'Time (24h)', type: 'time-picker', required: true }
            )
          }
          fields.push({
            name: 'description',
            label: isTaskMode ? 'Description (optional)' : 'Short description',
            type: 'textarea',
            placeholder: isTaskMode ? 'Brief description' : 'Brief description of the meeting',
            rows: 3,
          })
          return fields
        })()}
        initialValues={(() => {
          const isTaskMode = modalMode === 'editTask'
          const isMeetingMode = modalMode === 'editMeeting' || modalMode === 'createMeeting'

          const initialTitle =
            modalMode === 'createMeeting' ? newTaskTitle : (modalContext?.task?.title ?? '')

          const initialDescription =
            modalContext?.task?.type === 'meeting'
              ? modalContext.task.eventId
                ? (events.find(e => e.id === modalContext.task!.eventId)?.description ?? '')
                : ''
              : (modalContext?.task?.description ?? '')

          let initialDate = ''
          let initialTime = '09:00'

          if (isMeetingMode) {
            if (modalMode === 'createMeeting' && modalContext?.meetingDate) {
              initialDate = formatDateInput(modalContext.meetingDate)
            } else if (modalContext?.task?.type === 'meeting') {
              if (modalContext.task.eventId) {
                const ev = events.find(e => e.id === modalContext.task!.eventId)
                if (ev) {
                  initialDate = formatDateInput(new Date(ev.date))
                  initialTime = parseTimeFromDate(ev.date)
                }
              } else {
                const colIdx = dayColumns.indexOf(modalContext.columnId)
                const d = new Date(weekStart)
                d.setDate(weekStart.getDate() + colIdx)
                initialDate = formatDateInput(d)
              }
            }
          }

          return {
            title: initialTitle,
            description: initialDescription,
            ...(isTaskMode ? {} : { date: initialDate, time: initialTime }),
          }
        })()}
        onClose={() => {
          setModalOpen(false)
          setModalContext(null)
          if (modalMode === 'createMeeting') {
            setNewTaskTitle('')
            setNewTaskType('task')
          }
        }}
        onSubmit={data => {
          const ctx = modalContext
          if (!ctx) return

          const payload = {
            title: String(data.title ?? ''),
            description: String(data.description ?? ''),
            date: data.date ? String(data.date) : undefined,
            time: data.time ? String(data.time) : undefined,
          }

          if (modalMode === 'editTask') {
            updateBoard(prev => ({
              ...prev,
              [ctx.columnId]: prev[ctx.columnId].map(task =>
                task.id === ctx.task!.id
                  ? { ...task, title: payload.title, description: payload.description }
                  : task
              ),
            }))
          } else if (modalMode === 'editMeeting' && ctx.task) {
            if (ctx.task.eventId && payload.date && payload.time) {
              const ev = events.find(e => e.id === ctx.task!.eventId)
              if (ev) {
                const [y, m, d] = payload.date.split('-').map(Number)
                const [h, min] = payload.time.split(':').map(Number)
                const eventDate = new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0)
                dispatch(
                  updateEvent({
                    ...ev,
                    title: payload.title,
                    description: payload.description,
                    date: eventDate.toISOString(),
                  })
                )
              }
            }
            updateBoard(prev => ({
              ...prev,
              [ctx.columnId]: prev[ctx.columnId].map(task =>
                task.id === ctx.task!.id ? { ...task, title: payload.title } : task
              ),
            }))
          } else if (modalMode === 'createMeeting' && payload.date && payload.time) {
            const [y, m, d] = payload.date.split('-').map(Number)
            const [h, min] = payload.time.split(':').map(Number)
            const eventDate = new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0)
            const numericIds = events.map(e =>
              typeof e.id === 'number' ? e.id : parseInt(String(e.id), 10) || 0
            )
            const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1

            dispatch(
              addEvent({
                title: payload.title,
                description: payload.description,
                type: 'meeting' as EventType,
                date: eventDate.toISOString(),
              })
            )

            updateBoard(prev => {
              const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
              const task: Task = { id, title: payload.title, type: 'meeting', eventId: nextId }
              const col = ctx.meetingColumn ?? ctx.columnId
              return {
                ...prev,
                [col]: [...prev[col], task],
              }
            })
          }

          setModalOpen(false)
          setModalContext(null)
          setNewTaskTitle('')
          setNewTaskType('task')
        }}
      />
    </>
  )
}
