import styles from '@/app/components-styles/Title.module.css'
import { ReactNode } from 'react'
interface TitleProps {
  titleText: string
  subtitleText: string
  buttonText?: string
  onButtonClick?: () => void
  buttonIcon?: ReactNode
}
export default function Title({
  titleText,
  subtitleText,
  buttonText,
  buttonIcon,
  onButtonClick,
}: TitleProps) {
  return (
    <div className={styles.title_container}>
      <div>
        <h1 className={styles.title_text}>{titleText}</h1>
        <p className={styles.subtitle_text}>{subtitleText}</p>
      </div>
      {buttonText && (
        <button className={styles.title_button} onClick={onButtonClick}>
          {buttonIcon}
          {buttonText}
        </button>
      )}
    </div>
  )
}
