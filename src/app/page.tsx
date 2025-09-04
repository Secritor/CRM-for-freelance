import styles from './page.module.css'
import { Users, Briefcase, DollarSign, TrendingUp, Clock, Calendar } from 'lucide-react'

interface SummaryData {
  totalClients: number
  activeDeals: number
  monthlyIncome: number
  totalIncome: number
}

const summaryData: SummaryData = {
  totalClients: 12,
  activeDeals: 8,
  monthlyIncome: 8500,
  totalIncome: 45000,
}

type DealStatus = 'active' | 'pending' | 'completed'

interface Deal {
  id: number
  title: string
  client: string
  amount: number
  status: DealStatus
  date: Date
}

type EventType = 'meeting' | 'deadline'

interface Event {
  id: number
  title: string
  type: EventType
  date: Date
  description: string
}

const dealsList: Deal[] = [
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

const EventsList: Event[] = [
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

const summaryConfig = [
  { key: 'totalClients', label: 'Total Clients', icon: <Users />, color: 'primary' },
  { key: 'activeDeals', label: 'Active Deals', icon: <Briefcase />, color: 'success' },
  { key: 'monthlyIncome', label: 'Monthly Income', icon: <DollarSign />, color: 'warning' },
  { key: 'totalIncome', label: 'Total Income', icon: <TrendingUp />, color: 'primary' },
] as const

const getEventIcon = (type: EventType): React.ReactNode => {
  switch (type) {
    case 'meeting':
      return <Users className={styles.event_icon} />
    case 'deadline':
      return <Clock className={styles.event_icon} />
    default:
      return <Calendar className={styles.event_icon} />
  }
}

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Dashboard</h2>
        <p>Welcome back! Here`s what`s happening with your business</p>
      </div>

      <div className={styles.short_info}>
        {summaryConfig.map(({ key, label, icon, color }) => (
          <div key={key} className={styles.card}>
            <div className={`${styles.icon_wrap} ${styles[color]}`}>{icon}</div>
            <div className={styles.card_info_wrap}>
              <p className={styles.card_label}>{label}</p>
              <p className={styles.card_value}>
                {key.includes('Income')
                  ? `$${summaryData[key].toLocaleString()}`
                  : summaryData[key]}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.main_info}>
        <div className={styles.recent_deals}>
          <p className={styles.main_info_title}>Recent deals</p>
          <div className={styles.recent_deals_card}>
            {dealsList.map(deal => (
              <div key={deal.id} className={styles.deal}>
                <div className={styles.deal_left_info}>
                  <div className={styles.deal_title}>{deal.title}</div>
                  <div className={styles.deal_client}>{deal.client}</div>
                  <div className={styles.deal_date}>{deal.date.toLocaleDateString()}</div>
                </div>

                <div className={styles.deal_right_info}>
                  <div className={styles.deal_amount}>${deal.amount}</div>
                  <div
                    className={`${styles.deal_status} ${
                      deal.status === 'active'
                        ? styles.success
                        : deal.status === 'pending'
                          ? styles.warning
                          : styles.primary
                    }`}
                  >
                    {deal.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.upcoming_events}>
          <p className={styles.main_info_title}>Upcoming Events</p>
          <div className={styles.event_info}>
            {EventsList.map(event => (
              <div key={event.id} className={styles.event_card}>
                <div className={styles.event_logo}>{getEventIcon(event.type)}</div>
                <div className={styles.event_info_group}>
                  <div className={styles.event_title}>{event.title}</div>
                  <div className={styles.event_description}>{event.description}</div>
                  <div className={styles.event_date}>{event.date.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.long_info}></div>
    </div>
  )
}
