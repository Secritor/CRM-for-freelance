import type { Event, Client } from '../interfaces/main'
export const summaryConfig = [
  { key: 'totalClients', title: 'Total Clients', icon: 'users', color: 'primary', value: 12 },
  { key: 'activeDeals', title: 'Active Deals', icon: 'briefCase', color: 'success', value: 8 },
  {
    key: 'monthlyIncome',
    title: 'Monthly Income',
    icon: 'dollarSign',
    color: 'warning',
    value: 8500,
  },
  {
    key: 'totalIncome',
    title: 'Total Income',
    icon: 'trendingUp',
    color: 'primary',
    value: 45000,
  },
]

export const EventsList: Event[] = [
  {
    id: 1,
    title: 'Client Meeting - TechCorp',
    type: 'meeting',
    date: new Date(2024, 1, 25, 14, 0),
    description: 'Discuss website redesign progress',
  },
  {
    id: 2,
    title: 'Project Deadline - Mobile App',
    type: 'deadline',
    date: new Date(2024, 1, 28, 17, 0),
    description: 'Submit final deliverables',
  },
]

export const clientData: Client[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    address: '123 Business St, New York, NY',
    notes: 'Prefers email communication',
    createdAt: '15.01.2024',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@startupxyz.com',
    phone: '+1 (555) 987-6543',
    company: 'StartupXYZ',
    address: '456 Innovation Ave, San Francisco, CA',
    notes: 'Interested in mobile app development',
    createdAt: '20.01.2024',
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike@creativeagency.com',
    phone: '+1 (555) 456-7890',
    company: 'Creative Agency',
    address: '789 Design Blvd, Los Angeles, CA',
    notes: 'Regular client, pays on time',
    createdAt: '05.02.2024',
  },
]
