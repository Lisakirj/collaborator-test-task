import './TicketList.scss'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { moreTicketsShown, PAGE_SIZE } from '../../features/pagination/paginationSlice'
import {
  fetchTickets,
  selectTicketsStatus,
  type TicketsStatus,
} from '../../features/tickets/ticketsSlice'
import {
  selectFoundCount,
  selectHasMore,
  selectNextPageSize,
  selectVisibleTickets,
} from '../../features/selectors'

import { formatFoundLabel, formatShowMoreLabel, NO_RESULTS_MESSAGE } from '../../utils/format'

import Button from '../Button/Button'
import StatusMessage from '../StatusMessage/StatusMessage'
import TicketCard from '../TicketCard/TicketCard'
import TicketSkeleton from '../TicketSkeleton/TicketSkeleton'


const SKELETON_KEYS = Array.from({ length: PAGE_SIZE }, (_, index) => index)

// text for live region: screen reader knows about loading and the number of found tickets
const getAnnouncement = (status: TicketsStatus, foundCount: number): string => {
  switch (status) {
    case 'idle':
    case 'loading':
      return 'Завантажуємо квитки…'
    case 'succeeded':
      return formatFoundLabel(foundCount)
    case 'failed':
      return '' // error is announced by role="alert" in the message itself
  }
}

const LoadError = () => {
  const dispatch = useAppDispatch()

  return (
    <StatusMessage
      role="alert"
      title="Не вдалося завантажити квитки"
      description="Перевірте з’єднання з інтернетом і спробуйте ще раз."
      action={
        <Button
          onClick={() => {
            void dispatch(fetchTickets())
          }}
        >
          Спробувати ще раз
        </Button>
      }
    />
  )
}

const Results = () => {
  const dispatch = useAppDispatch()
  const tickets = useAppSelector(selectVisibleTickets)
  const hasMore = useAppSelector(selectHasMore)
  const nextPageSize = useAppSelector(selectNextPageSize)

  return (
    <>
      <ul className="ticket-list__items" role="list">
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <TicketCard ticket={ticket} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <Button block onClick={() => dispatch(moreTicketsShown())}>
          {formatShowMoreLabel(nextPageSize)}
        </Button>
      )}
    </>
  )
}

const TicketListBody = ({ status, isEmpty }: { status: TicketsStatus; isEmpty: boolean }) => {
  switch (status) {
    case 'idle':
    case 'loading':
      return SKELETON_KEYS.map((key) => <TicketSkeleton key={key} />)
    case 'failed':
      return <LoadError />
    case 'succeeded':
      return isEmpty ? (
        <StatusMessage
          title={NO_RESULTS_MESSAGE}
          description="Спробуйте обрати іншу кількість пересадок"
        />
      ) : (
        <Results />
      )
  }
}

export const TicketList = () => {
  const status = useAppSelector(selectTicketsStatus)
  const foundCount = useAppSelector(selectFoundCount)
  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div className="ticket-list" aria-busy={isLoading}>
      <p className="ticket-list__announcement" role="status">
        {getAnnouncement(status, foundCount)}
      </p>
      <TicketListBody status={status} isEmpty={foundCount === 0} />
    </div>
  )
};

export default TicketList;