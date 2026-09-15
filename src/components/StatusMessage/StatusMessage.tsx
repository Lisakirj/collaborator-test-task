import './StatusMessage.scss'
import type { ReactNode } from 'react'

interface StatusMessageProps {
  title: string
  description?: string
  action?: ReactNode
  role?: 'alert'// alert for error
}

const StatusMessage = ({ title, description, action, role }: StatusMessageProps) => {
  return (
    <div className="status-message" role={role}>
      <p className="status-message__title">{title}</p>
      {description && <p className="status-message__description">{description}</p>}
      {action && <div className="status-message__action">{action}</div>}
    </div>
  )
}

export default StatusMessage
