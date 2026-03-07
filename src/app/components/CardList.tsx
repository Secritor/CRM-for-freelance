import { ReactNode } from 'react'
import styles from '@/app/components-styles/CardList.module.css'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'
import type { CardItem, CardFormat, CardIcon } from '@/interfaces/main'

interface CardListProps {
  cards: CardItem[]
}

const iconParser: Record<CardIcon, ReactNode> = {
  dollarSign: <DollarSign />,
  briefCase: <Briefcase />,
  trendingUp: <TrendingUp />,
  users: <Users />,
}

export default function CardList({ cards }: CardListProps) {
  const formatValue = (value: number, format?: CardFormat) => {
    if (format === 'money') {
      return '$' + value.toLocaleString('en-US')
    }
    if (format === 'percent') {
      return value.toLocaleString('en-US') + '%'
    }
    return value.toLocaleString('en-US')
  }

  return (
    <div className={styles.short_info}>
      {cards.map((card, index) => {
        const IconComponent = iconParser[card.icon] ?? null

        return (
          <div key={card.key ?? index} className={styles.card}>
            <div className={`${styles.icon_wrap} ${styles[card.color]}`}>{IconComponent}</div>

            <div className={styles.card_info_wrap}>
              <p className={styles.card_label}>{card.title}</p>
              <p className={styles.card_value}>{formatValue(card.value, card.format)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
