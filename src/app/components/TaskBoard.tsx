import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from '@/app/components-styles/TaskBoard.module.css'
import { deleteEvent } from '@/features/events/eventsSlice'
import TaskBoardModal from './TaskBoardModal'

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

export default function TaskBoard({
  weekStart,
  board,
  onBoardChange,
  onWeekChange,
}: TaskBoardProps) {
  const dispatch = useDispatch()

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

  const handleModalClose = useCallback(
    (options?: { resetNewTask?: boolean }) => {
      setModalOpen(false)
      setModalContext(null)
      if (options?.resetNewTask) {
        setNewTaskTitle('')
        setNewTaskType('task')
      }
    },
    []
  )

  // CRUD
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
  // drag and drop
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

      <TaskBoardModal
        open={modalOpen}
        mode={modalMode}
        context={modalContext}
        weekStart={weekStart}
        newTaskTitle={newTaskTitle}
        onUpdateBoard={updateBoard}
        onClose={handleModalClose}
      />
    </>
  )
}
