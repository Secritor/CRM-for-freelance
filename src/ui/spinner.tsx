import { LoaderCircle } from 'lucide-react'
import './spinner.css'

interface SpinnerProps extends React.ComponentProps<'svg'> {
  className?: string
}
function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <LoaderCircle
      role="status"
      aria-label="Loading"
      className={`spinner ${className}`}
      {...props}
    />
  )
}

export { Spinner }
