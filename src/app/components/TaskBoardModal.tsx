import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UniversalModal from './UniversalModal'
import type { FieldConfig } from '@/interfaces/main'
import { formatDateInput } from '@/lib/dateUtils'
import { addEvent, updateEvent } from '@/features/events/eventsSlice'
import type { EventType } from '@/interfaces/main'
import type { RootState } from '@/store/store'

const dayColumns = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'] as const

type DayColumnId = (typeof dayColumns)[number]

type TaskType = 'task' | 'meeting'

type Task = {
  id: string
  title: string
  type: TaskType
  eventId?: number
  description?: string
}

type BoardState = Record<DayColumnId, Task[]>

type TaskBoardModalMode = 'createMeeting' | 'editTask' | 'editMeeting'

type TaskBoardModalContext = {
  columnId: DayColumnId
  task?: Task
  meetingDate?: Date
  meetingColumn?: DayColumnId
} | null

type TaskBoardModalProps = {
  open: boolean
  mode: TaskBoardModalMode
  context: TaskBoardModalContext
  weekStart: Date
  newTaskTitle: string
  onUpdateBoard: (updater: (prev: BoardState) => BoardState) => void
  onClose: (options?: { resetNewTask?: boolean }) => void
}

const parseTimeFromDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function TaskBoardModal({
  open,
  mode,
  context,
  weekStart,
  newTaskTitle,
  onUpdateBoard,
  onClose,
}: TaskBoardModalProps) {
  const dispatch = useDispatch()
  const events = useSelector((state: RootState) => state.events.events)

  const title =
    mode === 'editTask' ? 'Edit task' : mode === 'createMeeting' ? 'Create meeting' : 'Edit meeting'

  const description =
    mode === 'editTask' ? 'Update task details' : 'Configure meeting details'

  const submitText =
    mode === 'editTask'
      ? 'Save task'
      : mode === 'createMeeting'
        ? 'Create meeting'
        : 'Save meeting'

  const fields: FieldConfig[] = (() => {
    const isTaskMode = mode === 'editTask'
    const result: FieldConfig[] = [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: isTaskMode ? 'Task title' : 'Meeting title',
      },
    ]
    if (!isTaskMode) {
      result.push(
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'time', label: 'Time (24h)', type: 'time-picker', required: true }
      )
    }
    result.push({
      name: 'description',
      label: isTaskMode ? 'Description (optional)' : 'Short description',
      type: 'textarea',
      placeholder: isTaskMode ? 'Brief description' : 'Brief description of the meeting',
      rows: 3,
    })
    return result
  })()

  const initialValues = (() => {
    const isTaskMode = mode === 'editTask'
    const isMeetingMode = mode === 'editMeeting' || mode === 'createMeeting'

    const initialTitle =
      mode === 'createMeeting' ? newTaskTitle : (context?.task?.title ?? '')

    const initialDescription =
      context?.task?.type === 'meeting'
        ? context.task.eventId
          ? (events.find(e => e.id === context.task!.eventId)?.description ?? '')
          : ''
        : (context?.task?.description ?? '')

    let initialDate = ''
    let initialTime = '09:00'

    if (isMeetingMode) {
      if (mode === 'createMeeting' && context?.meetingDate) {
        initialDate = formatDateInput(context.meetingDate)
      } else if (context?.task?.type === 'meeting') {
        if (context.task.eventId) {
          const ev = events.find(e => e.id === context.task!.eventId)
          if (ev) {
            initialDate = formatDateInput(new Date(ev.date))
            initialTime = parseTimeFromDate(ev.date)
          }
        } else {
          const colIdx = dayColumns.indexOf(context.columnId)
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
  })()

  const handleClose = () => {
    onClose({ resetNewTask: mode === 'createMeeting' })
  }

  const handleSubmit = (data: Record<string, string | number | null>) => {
    const ctx = context
    if (!ctx) {
      onClose()
      return
    }

    const payload = {
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      date: data.date ? String(data.date) : undefined,
      time: data.time ? String(data.time) : undefined,
    }

    if (mode === 'editTask') {
      onUpdateBoard(prev => ({
        ...prev,
        [ctx.columnId]: prev[ctx.columnId].map(task =>
          task.id === ctx.task!.id
            ? { ...task, title: payload.title, description: payload.description }
            : task
        ),
      }))
    } else if (mode === 'editMeeting' && ctx.task) {
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
      onUpdateBoard(prev => ({
        ...prev,
        [ctx.columnId]: prev[ctx.columnId].map(task =>
          task.id === ctx.task!.id ? { ...task, title: payload.title } : task
        ),
      }))
    } else if (mode === 'createMeeting' && payload.date && payload.time) {
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

      onUpdateBoard(prev => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const task: Task = { id, title: payload.title, type: 'meeting', eventId: nextId }
        const col = ctx.meetingColumn ?? ctx.columnId
        return {
          ...prev,
          [col]: [...prev[col], task],
        }
      })
    }

    onClose({ resetNewTask: true })
  }

  return (
    <UniversalModal
      open={open}
      title={title}
      description={description}
      submitText={submitText}
      fields={fields}
      initialValues={initialValues}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  )
}

