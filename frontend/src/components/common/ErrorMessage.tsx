import { memo } from 'react'
import '../../styles/components.css'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  showIcon?: boolean
}

const ErrorMessage = memo(function ErrorMessage({ 
  title = 'Oops! Something went wrong',
  message, 
  onRetry,
  showIcon = true 
}: ErrorMessageProps) {
  return (
    <div className="error-message-container">
      {showIcon && <div className="error-icon">⚠️</div>}
      <h2 className="error-title">{title}</h2>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry-btn">
          Try Again
        </button>
      )}
    </div>
  )
})

export default ErrorMessage
