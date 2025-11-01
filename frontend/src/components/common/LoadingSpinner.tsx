import '../../styles/components.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
}

function LoadingSpinner({ size = 'medium', message }: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <div className={`loading-spinner loading-spinner--${size}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
