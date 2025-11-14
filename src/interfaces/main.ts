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
  id: number
  title: string
  client: string
  amount: number
  status: DealStatus
  date: Date | string
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
