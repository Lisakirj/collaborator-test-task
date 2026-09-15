import './TicketSkeleton.scss'

const TicketSkeleton = () => {
  return (
    <div className="ticket-skeleton" aria-hidden="true">
      <div className="ticket-skeleton__header">
        <span className="ticket-skeleton__bone ticket-skeleton__bone--price" />
        <span className="ticket-skeleton__bone ticket-skeleton__bone--logo" />
      </div>
      <span className="ticket-skeleton__bone ticket-skeleton__bone--segment" />
      <span className="ticket-skeleton__bone ticket-skeleton__bone--segment" />
    </div>
  )
}

export default TicketSkeleton