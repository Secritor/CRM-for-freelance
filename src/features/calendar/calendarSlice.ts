import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { BoardState } from '@/app/components/TaskBoard'
import { createEmptyBoard } from '@/app/components/TaskBoard'
import { getCurrentWeekStart, getWeekKey } from '@/lib/dateUtils'

interface CalendarState {
  weekBoards: Record<string, BoardState>
  weekStart: string
  calendarDisplayDate: string
}

const initialWeekStart = getCurrentWeekStart()
const initialWeekKey = getWeekKey(initialWeekStart)

const initialState: CalendarState = {
  weekBoards: {
    [initialWeekKey]: createEmptyBoard(),
  },
  weekStart: initialWeekKey,
  calendarDisplayDate: initialWeekKey,
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setWeekBoards: (state, action: PayloadAction<Record<string, BoardState>>) => {
      state.weekBoards = action.payload
    },
    updateBoard: (
      state,
      action: PayloadAction<{ weekKey: string; board: BoardState }>
    ) => {
      const { weekKey, board } = action.payload
      state.weekBoards[weekKey] = board
    },
    setWeekStart: (state, action: PayloadAction<string>) => {
      state.weekStart = action.payload
      const key = action.payload
      if (!(key in state.weekBoards)) {
        state.weekBoards[key] = createEmptyBoard()
      }
    },
    setCalendarDisplayDate: (state, action: PayloadAction<string>) => {
      state.calendarDisplayDate = action.payload
    },
  },
})

export const { setWeekBoards, updateBoard, setWeekStart, setCalendarDisplayDate } =
  calendarSlice.actions

export const getWeekKeyHelper = getWeekKey

export default calendarSlice.reducer
