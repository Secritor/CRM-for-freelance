import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Client, ClientsState } from '@/interfaces/main'
import { clientData } from '@/app/mockData'

const initialState: ClientsState = {
  clients: clientData,
  search: '',
  editingClient: null,
  modalOpen: false,
}

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload
    },
    addClient: (state, action: PayloadAction<Omit<Client, 'id' | 'createdAt'>>) => {
      const id = crypto.randomUUID()
      state.clients.push({ ...action.payload, id, createdAt: new Date().toISOString() })
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      state.clients = state.clients.map(c => (c.id === action.payload.id ? action.payload : c))
      state.editingClient = null
    },
    deleteClient: (state, action: PayloadAction<number>) => {
      state.clients = state.clients.filter(c => c.id !== action.payload)
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setEditingClient: (state, action: PayloadAction<Client | null>) => {
      state.editingClient = action.payload
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload
      if (!action.payload) state.editingClient = null
    },
  },
})

export const {
  setClients,
  addClient,
  updateClient,
  deleteClient,
  setSearch,
  setEditingClient,
  setModalOpen,
} = clientsSlice.actions

export default clientsSlice.reducer
