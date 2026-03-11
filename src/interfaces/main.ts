// ==================== Client ====================
export interface Client {
  id: number | string
  name: string
  email: string
  phone: string
  company: string
  address: string
  notes: string
  createdAt: Date | string
}

export interface ClientsState {
  clients: Client[]
  search: string
  editingClient: Client | null
  modalOpen: boolean
}

export interface ClientsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddClient: (data: Omit<Client, 'id' | 'createdAt'>) => void
  onEditClient?: (data: Client) => void
  initialData?: Client | null
}

// ==================== Deal ====================
export type DealStatus = 'active' | 'pending' | 'completed' | 'cancelled'

export interface Deal {
  id: number | string
  title: string
  description?: string
  clientId: number | string
  clientName: string
  clientCompany: string
  amount: number
  status: DealStatus
  startDate: string
  endDate: string
  createdAt: string
}

export interface DealsState {
  deals: Deal[]
  searchTerm: string
  statusFilter: string
  editingDeal: Deal | null
  isModalOpen: boolean
}

// ==================== Event ====================
export type EventType = 'meeting' | 'deadline'

export interface Event {
  id: number | string
  title: string
  type: EventType
  date: Date | string
  description: string
}

// ==================== Summary ====================
export interface SummaryData {
  totalClients: number
  activeDeals: number
  monthlyIncome: number
  totalIncome: number
}

// ==================== Card ====================
export type CardFormat = 'money' | 'number' | 'percent'
export type CardColor = 'primary' | 'success' | 'warning' | 'danger'
export type CardIcon = 'users' | 'briefCase' | 'dollarSign' | 'trendingUp'

export interface CardItem {
  key: string
  title: string
  value: number
  color: CardColor
  icon: CardIcon
  format?: CardFormat
}

// ==================== Tab ====================
export interface TabProps {
  array: Deal[]
  openEditModal: (deal: Deal) => void
  handleDeleteDeal: (id: Deal['id']) => void
}

// ==================== Modal Fields ====================
export type FieldType = 'text' | 'email' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'time-picker'

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: { value: string | number; label: string }[]
  placeholder?: string
  rows?: number
}
