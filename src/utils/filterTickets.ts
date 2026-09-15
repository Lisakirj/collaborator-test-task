import {
  STOPS_COUNTS,
  type StopsCount,
  type Ticket,
} from '../features/tickets/types';
import { getStopsCount } from './ticket';

export const areAllStopsSelected = (
  selected: readonly StopsCount[],
): boolean => {
  return STOPS_COUNTS.every((count) => selected.includes(count));
};

//Leaves tickets with the selected number of stops; an empty selection gives an empty list
export const filterTicketsByStops = (
  tickets: readonly Ticket[],
  selected: readonly StopsCount[],
): Ticket[] => {
  const allowed = new Set<number>(selected);
  return tickets.filter((ticket) => allowed.has(getStopsCount(ticket)));
};
