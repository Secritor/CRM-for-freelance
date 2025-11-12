// store.ts
import { configureStore } from '@reduxjs/toolkit'
import clientsReducer from '../features/clients/clientsSlice'

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
