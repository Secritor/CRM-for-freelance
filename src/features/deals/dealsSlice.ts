import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setSearch, updateClient } from '../clients/clientsSlice'
import { act } from 'react'
export interface Deal {
  id: number
  title: string
  clientId: number | string
  clientName: string
  clientCompany: string
  amount: number
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  description?: string
  createdAt: string
}

interface DealsState {
  deals: Deal[]
  clients: { id: number; name: string; company: string }[]
  searchTerm: string
  statusFilter: string
}

const initialState: DealsState = {
  deals: [],
  clients: [],
  searchTerm: '',
  statusFilter: 'all',
}

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setDeals(state, action: PayloadAction<Deal[]>) {
      state.deals = action.payload
    },
    setClients(state, action: PayloadAction<DealsState['clients']>) {
      state.clients = action.payload
    },
    addDeal(state, action: PayloadAction<Deal>) {
      state.deals.push(action.payload)
    },
    updateDeal(state, action: PayloadAction<Deal>) {
      state.deals = state.deals.map(d => (d.id === action.payload.id ? action.payload : d))
    },
    deleteDeal(state, action: PayloadAction<number | string>) {
      state.deals = state.deals.filter(d => d.id !== action.payload)
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload
    },
  },
})

export const {
  setDeals,
  setClients,
  addDeal,
  updateDeal,
  deleteDeal,
  setSearchTerm,
  setStatusFilter,
} = dealsSlice.actions

export default dealsSlice.reducer
