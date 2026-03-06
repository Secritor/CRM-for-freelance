import { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export default function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={`${styles.empty_state} ${className ?? ''}`}>
      <div className={styles.empty_icon}>{icon}</div>
      <p className={styles.empty_title}>{title}</p>
      <p className={styles.empty_description}>{description}</p>
    </div>
  )
}
