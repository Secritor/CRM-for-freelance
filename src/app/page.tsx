import { useMemo } from 'react'
import styles from './page.module.css'
import { Users, Clock, Calendar } from 'lucide-react'
import type { EventType } from '../interfaces/main'
import Title from './components/Title'
import CardList from './components/CardList'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { isInCurrentWeek, parseDate, formatDisplayDate, getDaysAgo, getYearsAgo } from '@/lib/dateUtils'

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
  const events = useSelector((state: RootState) => state.events.events)
  const deals = useSelector((state: RootState) => state.deals.deals)
  const clients = useSelector((state: RootState) => state.clients.clients)

  const summaryStats = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = getDaysAgo(30)
    const oneYearAgo = getYearsAgo(1)

    const totalClients = clients.length
    const activeDeals = deals.filter(d => d.status === 'active').length

    const completedDeals = deals.filter(d => d.status === 'completed')

    const monthlyIncome = completedDeals
      .filter(d => {
        if (!d.endDate) return false
        const endDate = parseDate(d.endDate)
        return endDate >= thirtyDaysAgo && endDate <= now
      })
      .reduce((sum, d) => sum + d.amount, 0)

    const totalIncome = completedDeals
      .filter(d => {
        if (!d.endDate) return false
        const endDate = parseDate(d.endDate)
        return endDate >= oneYearAgo && endDate <= now
      })
      .reduce((sum, d) => sum + d.amount, 0)

    return [
      { key: 'totalClients', title: 'Total Clients', icon: 'users' as const, color: 'primary' as const, value: totalClients },
      { key: 'activeDeals', title: 'Active Deals', icon: 'briefCase' as const, color: 'success' as const, value: activeDeals },
      { key: 'monthlyIncome', title: 'Monthly Income', icon: 'dollarSign' as const, color: 'warning' as const, value: monthlyIncome, format: 'money' as const },
      { key: 'totalIncome', title: 'Total Income', icon: 'trendingUp' as const, color: 'primary' as const, value: totalIncome, format: 'money' as const },
    ]
  }, [clients, deals])

  const upcomingEvents = events
    .map(event => ({ event, date: parseDate(event.date) }))
    .filter(({ date }) => !Number.isNaN(date.getTime()) && isInCurrentWeek(date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ event }) => event)

  const recentDeals = [...deals]
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0
      if (!a.createdAt) return 1
      if (!b.createdAt) return -1
      return parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
    })
    .slice(0, 5)

  return (
    <div className={styles.container}>
      <Title
        titleText={'Dashboard'}
        subtitleText={'Welcome back! Here`s what`s happening with your business'}
      />
      <CardList cards={summaryStats} />

      <div className={styles.main_info}>
        <div className={styles.recent_deals}>
          <p className={styles.main_info_title}>Recent deals</p>
          <div className={styles.recent_deals_card}>
            {recentDeals.length === 0 && (
              <p className={styles.event_empty}>No deals yet.</p>
            )}
            {recentDeals.map(deal => (
              <div key={deal.id} className={styles.deal}>
                <div className={styles.deal_left_info}>
                  <div className={styles.deal_title}>{deal.title}</div>
                  <div className={styles.deal_client}>{deal.clientName}</div>
                  <div className={styles.deal_date}>End: {formatDisplayDate(deal.endDate)}</div>
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
            {upcomingEvents.length === 0 && (
              <p className={styles.event_empty}>No events scheduled for this week.</p>
            )}

            {upcomingEvents.map(event => (
              <div key={event.id} className={styles.event_card}>
                <div className={styles.event_logo}>{getEventIcon(event.type)}</div>
                <div className={styles.event_info_group}>
                  <div className={styles.event_title}>{event.title}</div>
                  <div className={styles.event_description}>{event.description}</div>
                  <div className={styles.event_date}>
                    {formatDisplayDate(event.date)}, {parseDate(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
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
