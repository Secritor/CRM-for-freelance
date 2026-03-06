import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Event } from '@/interfaces/main'
import { EventsList as initialEvents } from '@/app/mockData'

interface EventsState {
  events: Event[]
}

const initialState: EventsState = {
  events: initialEvents,
}

type NewEventPayload = Omit<Event, 'id'>

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<Event[]>) {
      state.events = action.payload
    },
    addEvent(state, action: PayloadAction<NewEventPayload>) {
      const numericIds = state.events.map(e => (typeof e.id === 'number' ? e.id : parseInt(String(e.id), 10) || 0))
      const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1
      state.events.push({
        ...action.payload,
        id: nextId,
      })
    },
    updateEvent(state, action: PayloadAction<Event>) {
      const index = state.events.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = action.payload
      }
    },
    deleteEvent(state, action: PayloadAction<number | string>) {
      state.events = state.events.filter(e => e.id !== action.payload)
    },
  },
})

export const { setEvents, addEvent, updateEvent, deleteEvent } = eventsSlice.actions

export default eventsSlice.reducer

