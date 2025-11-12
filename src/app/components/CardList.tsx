import { ReactNode } from 'react'
import styles from './CardList.module.css'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'
interface CardItem {
  key: string
  title: string
  value: number | string
  color: string
  icon: string
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
  return (
    <div className={styles.short_info}>
      {cards.map((card, index) => {
        const IconComponent = iconParser[card.icon] ?? null // если нет совпадения, null

        return (
          <div key={index} className={styles.card}>
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
