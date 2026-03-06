// store.ts
import { configureStore } from '@reduxjs/toolkit'
import clientsReducer from '../features/clients/clientsSlice'
import dealsReducer from '../features/deals/dealsSlice'
import eventsReducer from '../features/events/eventsSlice'
import calendarReducer from '../features/calendar/calendarSlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    deals: dealsReducer,
    events: eventsReducer,
    calendar: calendarReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
