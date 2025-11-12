import type { Deal, Event, Client } from '../interfaces/main'
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
export const dealsList: Deal[] = [
  {
    id: 1,
    title: 'Website Redesign',
    client: 'TechCorp Inc.',
    amount: 2500,
    status: 'active',
    date: new Date(2024, 1, 15),
  },
  {
    id: 2,
    title: 'Mobile App Development',
    client: 'StartupXYZ',
    amount: 5000,
    status: 'pending',
    date: new Date(2024, 1, 20),
  },
  {
    id: 3,
    title: 'Logo Design',
    client: 'Creative Agency',
    amount: 800,
    status: 'completed',
    date: new Date(2024, 1, 10),
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

export const initialClients: Client[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    address: '123 Business St, New York, NY',
    notes: 'Prefers email communication',
    createdAt: new Date(2024, 0, 15),
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@startupxyz.com',
    phone: '+1 (555) 987-6543',
    company: 'StartupXYZ',
    address: '456 Innovation Ave, San Francisco, CA',
    notes: 'Interested in mobile app development',
    createdAt: new Date(2024, 0, 20),
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike@creativeagency.com',
    phone: '+1 (555) 456-7890',
    company: 'Creative Agency',
    address: '789 Design Blvd, Los Angeles, CA',
    notes: 'Regular client, pays on time',
    createdAt: new Date(2024, 1, 5),
  },
]
