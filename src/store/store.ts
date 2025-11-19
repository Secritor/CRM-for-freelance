// store.ts
import { configureStore } from '@reduxjs/toolkit'
import clientsReducer from '../features/clients/clientsSlice'
import dealsReducer from '../features/deals/dealsSlice'

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    deals: dealsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
