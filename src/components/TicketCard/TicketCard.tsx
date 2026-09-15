import './TicketCard.scss'
import { getCarrier } from '../../features/tickets/carriers'
import type { Ticket } from '../../features/tickets/types'
import { formatPrice, toSegmentView } from '../../utils/format'


interface TicketCardProps {
  ticket: Ticket
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const carrier = getCarrier(ticket.carrier)
  const segments = ticket.segments.map(toSegmentView)

  return (
    <article className="ticket">
      <header className="ticket__header">
        <p className="ticket__price">{formatPrice(ticket.price)}</p>
        {carrier ? (
          <img className="ticket__logo" src={carrier.logo} alt={carrier.name} width={119} height={41} />
        ) : (
          <p className="ticket__carrier">{ticket.carrier}</p>
        )}
      </header>
      {segments.map((segment) => (
        <div className="ticket__segment" key={segment.route}>
          <div className="ticket__cell">
            <span className="ticket__label">{segment.route}</span>
            <span className="ticket__value">{segment.time}</span>
          </div>
          <div className="ticket__cell">
            <span className="ticket__label">В дорозі</span>
            <span className="ticket__value">{segment.duration}</span>
          </div>
          <div className="ticket__cell">
            <span className="ticket__label">{segment.stopsLabel}</span>
            {segment.stopsList && <span className="ticket__value">{segment.stopsList}</span>}
          </div>
        </div>
      ))}
    </article>
  )
}

export default TicketCard