import { createSelector } from '@reduxjs/toolkit';
import {
  areAllStopsSelected,
  filterTicketsByStops,
} from '../utils/filterTickets';
import { sortTickets } from '../utils/sortTickets';
import { selectSelectedStops } from './filters/filtersSlice';
import { PAGE_SIZE, selectVisibleCount } from './pagination/paginationSlice';
import { selectSortBy } from './sort/sortSlice';
import { selectTicketItems } from './tickets/ticketsSlice';

//memoized selectors, only re-run when the input changes
export const selectIsAllStopsSelected = createSelector(
  [selectSelectedStops],
  areAllStopsSelected,
);
export const selectFilteredTickets = createSelector(
  [selectTicketItems, selectSelectedStops],
  filterTicketsByStops,
);

export const selectFoundCount = createSelector(
  [selectFilteredTickets],
  (tickets) => tickets.length,
);

export const selectSortedTickets = createSelector(
  [selectFilteredTickets, selectSortBy],
  sortTickets,
);

export const selectVisibleTickets = createSelector(
  [selectSortedTickets, selectVisibleCount],
  (tickets, visibleCount) => tickets.slice(0, visibleCount),
);

export const selectRemainingCount = createSelector(
  [selectSortedTickets, selectVisibleCount],
  (tickets, visibleCount) => Math.max(tickets.length - visibleCount, 0),
);

export const selectHasMore = createSelector(
  [selectRemainingCount],
  (remaining) => remaining > 0,
);

export const selectNextPageSize = createSelector(
  [selectRemainingCount],
  (remaining) => Math.min(remaining, PAGE_SIZE),
);
