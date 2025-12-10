export interface Client {
  id: number | string
  name: string
  email: string
  company: string
  address: string
  notes: string
  createdAt: Date | string
}

export interface SummaryData {
  totalClients: number
  activeDeals: number
  monthlyIncome: number
  totalIncome: number
}
export interface ClientsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddClient: (data: Omit<Client, 'id' | 'createdAt'>) => void
  onEditClient?: (data: Client) => void
  initialData?: Client | null
}

export type DealStatus = 'active' | 'pending' | 'completed'

export interface Deal {
  id: string | number
  title: string
  description: string
  clientName: string
  clientCompany: string
  amount: number
  status: DealStatus
  startDate: string
  endDate: string
}

export type EventType = 'meeting' | 'deadline'

export interface Event {
  id: number
  title: string
  type: EventType
  date: Date | string
  description: string
}
export interface ClientsState {
  clients: Client[]
  search: string
  editingClient: Client | null
  modalOpen: boolean
}

export interface TabProps {
  array: Deal[]
  openEditModal: (deal: Deal) => void
  handleDeleteDeal: (id: Deal['id']) => void
}
