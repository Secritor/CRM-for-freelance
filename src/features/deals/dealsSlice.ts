import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Deal, DealsState } from '@/interfaces/main'

export type { Deal }

const initialDeals: Deal[] = [
  {
    id: 1,
    title: 'Website Redesign',
    clientId: 1,
    clientName: 'John Smith',
    clientCompany: 'TechCorp Inc.',
    amount: 2500,
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-04-15',
    description: 'Complete website redesign with modern UI/UX',
    createdAt: '2026-01-15T10:30:00.000Z',
  },
  {
    id: 2,
    title: 'Mobile App Development',
    clientId: 2,
    clientName: 'Sarah Johnson',
    clientCompany: 'StartupXYZ',
    amount: 5000,
    status: 'pending',
    startDate: '2026-03-10',
    endDate: '2026-06-20',
    description: 'iOS and Android mobile application development',
    createdAt: '2026-02-20T14:15:00.000Z',
  },
  {
    id: 3,
    title: 'Logo Design',
    clientId: 3,
    clientName: 'Mike Wilson',
    clientCompany: 'Creative Agency',
    amount: 800,
    status: 'completed',
    startDate: '2026-01-10',
    endDate: '2026-01-25',
    description: 'Brand logo and identity design',
    createdAt: '2026-01-05T09:00:00.000Z',
  },
  {
    id: 4,
    title: 'E-commerce Platform',
    clientId: 1,
    clientName: 'John Smith',
    clientCompany: 'TechCorp Inc.',
    amount: 3500,
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-06-01',
    description: 'Full e-commerce platform with payment integration',
    createdAt: '2026-02-15T11:45:00.000Z',
  },
]

const initialState: DealsState = {
  deals: initialDeals,
  searchTerm: '',
  statusFilter: 'all',
  editingDeal: null,
  isModalOpen: false,
}

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setDeals(state, action: PayloadAction<Deal[]>) {
      state.deals = action.payload
    },
    addDeal(state, action: PayloadAction<Omit<Deal, 'id' | 'createdAt'>>) {
      const numericIds = state.deals.map(d => (typeof d.id === 'number' ? d.id : parseInt(String(d.id), 10) || 0))
      const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1
      state.deals.push({
        ...action.payload,
        id: nextId,
        createdAt: new Date().toISOString(),
      })
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
    openEditModal(state, action: PayloadAction<Deal | null>) {
      state.editingDeal = action.payload
      state.isModalOpen = true
    },
    closeModal(state) {
      state.editingDeal = null
      state.isModalOpen = false
    },
  },
})

export const {
  setDeals,
  addDeal,
  updateDeal,
  deleteDeal,
  setSearchTerm,
  setStatusFilter,
  openEditModal,
  closeModal,
} = dealsSlice.actions

export default dealsSlice.reducer
