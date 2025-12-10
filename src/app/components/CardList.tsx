import { ReactNode } from 'react'
import styles from './CardList.module.css'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'

interface CardItem {
  key: string
  title: string
  value: number
  color: string
  icon: string
  format?: 'money' | 'default'
}

interface CardListProps {
  cards: CardItem[]
}

const iconParser: Record<string, ReactNode> = {
  dollarSign: <DollarSign />,
  briefCase: <Briefcase />,
  trendingUp: <TrendingUp />,
  users: <Users />,
}

export default function CardList({ cards }: CardListProps) {
  // const formatMoney = (value: number | string) => {
  //   if (typeof value !== 'number') return value
  //   return new Intl.NumberFormat('ru-RU').format(value) + ' $'
  // }

  return (
    <div className={styles.short_info}>
      {cards.map((card, index) => {
        const IconComponent = iconParser[card.icon] ?? null

        return (
          <div key={card.key ?? index} className={styles.card}>
            <div className={`${styles.icon_wrap} ${styles[card.color]}`}>{IconComponent}</div>

            <div className={styles.card_info_wrap}>
              <p className={styles.card_label}>{card.title}</p>
              <p className={styles.card_value}>{card.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
