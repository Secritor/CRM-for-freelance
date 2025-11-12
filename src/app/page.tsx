import styles from './page.module.css'
import { Users, Briefcase, DollarSign, TrendingUp, Clock, Calendar } from 'lucide-react'
import type { EventType } from '../interfaces/main'
import { summaryConfig, dealsList, EventsList } from './mockData'
import Title from './components/Title'
import CardList from './components/CardList'

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
      <Title
        titleText={'Dashboard'}
        subtitleText={'Welcome back! Here`s what`s happening with your business'}
      />
      <CardList cards={summaryConfig} />

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
