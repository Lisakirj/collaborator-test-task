import type { Ticket } from '../features/tickets/types';
import { getStopsCount, getTotalDuration } from './ticket';

export type SortOption = 'cheapest' | 'fastest' | 'optimal';

type Comparator = (a: Ticket, b: Ticket) => number;

const byPrice: Comparator = (a, b) => a.price - b.price;
const byTotalDuration: Comparator = (a, b) =>
  getTotalDuration(a) - getTotalDuration(b);
const byStopsCount: Comparator = (a, b) => getStopsCount(a) - getStopsCount(b);
const byId: Comparator = (a, b) => {
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
};

// Applies comparators in order: each next comparator only resolves a tie
const compareBy = (...comparators: Comparator[]): Comparator => {
  return (a, b) => {
    for (const compare of comparators) {
      const result = compare(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
};

// Last criterion — id: ensures deterministic ordering even when all values are equal
const COMPARATORS: Record<SortOption, Comparator> = {
  cheapest: compareBy(byPrice, byId),
  fastest: compareBy(byTotalDuration, byPrice, byId),
  optimal: compareBy(byTotalDuration, byStopsCount, byPrice, byId),
};

// Returns a new sorted array without mutating the input array + Redux state
export const sortTickets = (
  tickets: readonly Ticket[],
  sortBy: SortOption,
): Ticket[] => {
  return [...tickets].sort(COMPARATORS[sortBy]);
};
