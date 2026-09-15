import { describe, expect, it } from 'vitest';
import { setupStore, type AppStore } from '../app/store';
import { CONTROL_TICKETS, ids } from '../test/fixtures';
import type { SortOption } from '../utils/sortTickets';
import {
  allStopsToggled,
  selectSelectedStops,
  stopToggled,
} from './filters/filtersSlice';
import {
  moreTicketsShown,
  selectVisibleCount,
} from './pagination/paginationSlice';
import {
  selectFilteredTickets,
  selectHasMore,
  selectIsAllStopsSelected,
  selectNextPageSize,
  selectSortedTickets,
  selectVisibleTickets,
} from './selectors';
import { selectSortBy, sortChanged } from './sort/sortSlice';
import type { StopsCount } from './tickets/types';

function createStore(): AppStore {
  return setupStore({
    tickets: { items: [...CONTROL_TICKETS], status: 'succeeded', error: null },
  });
}

// User flow: deselect all, then select the needed options
function selectOnlyStops(store: AppStore, stops: StopsCount[]) {
  store.dispatch(allStopsToggled());
  for (const count of stops) {
    store.dispatch(stopToggled(count));
  }
}

describe('stops filter', () => {
  it('selects every value by default, keeps "Всі" checked and shows all tickets', () => {
    const store = createStore();

    expect(selectSelectedStops(store.getState())).toEqual([0, 1, 2, 3]);
    expect(selectIsAllStopsSelected(store.getState())).toBe(true);
    expect(selectFilteredTickets(store.getState())).toHaveLength(6);
  });

  it('clicking "Всі" when everything is selected clears every option', () => {
    const store = createStore();

    store.dispatch(allStopsToggled());

    expect(selectSelectedStops(store.getState())).toEqual([]);
    expect(selectIsAllStopsSelected(store.getState())).toBe(false);
    expect(selectFilteredTickets(store.getState())).toEqual([]);
  });

  it('clicking "Всі" when something is unselected selects every option', () => {
    const store = createStore();
    store.dispatch(stopToggled(2));

    store.dispatch(allStopsToggled());

    expect(selectSelectedStops(store.getState())).toEqual([0, 1, 2, 3]);
  });

  it('"Всі" is unchecked with any option and checked again once all four are selected', () => {
    const store = createStore();

    store.dispatch(stopToggled(3));
    expect(selectIsAllStopsSelected(store.getState())).toBe(false);

    store.dispatch(stopToggled(3));
    expect(selectIsAllStopsSelected(store.getState())).toBe(true);
    expect(selectSelectedStops(store.getState())).toEqual([0, 1, 2, 3]);
  });

  it.each<[StopsCount[], string[]]>([
    [[0], ['T5']],
    [[1], ['T1', 'T3']],
    [
      [1, 2],
      ['T6', 'T1', 'T2', 'T3'],
    ],
    [[], []],
  ])('filter %j + cheapest → %j', (stops, expected) => {
    const store = createStore();

    selectOnlyStops(store, stops);

    expect(ids(selectSortedTickets(store.getState()))).toEqual(expected);
  });
});

describe('sorting', () => {
  it('defaults to "Найдешевший"', () => {
    const store = createStore();

    expect(selectSortBy(store.getState())).toBe('cheapest');
    expect(ids(selectSortedTickets(store.getState()))).toEqual([
      'T6',
      'T1',
      'T2',
      'T3',
      'T4',
      'T5',
    ]);
  });

  it.each<[SortOption, string[]]>([
    ['fastest', ['T5', 'T6', 'T3', 'T4', 'T1', 'T2']],
    ['optimal', ['T5', 'T3', 'T6', 'T4', 'T1', 'T2']],
  ])('%s → %j', (sortBy, expected) => {
    const store = createStore();

    store.dispatch(sortChanged(sortBy));

    expect(ids(selectSortedTickets(store.getState()))).toEqual(expected);
  });

  it('does not recompute the list until its inputs change', () => {
    const store = createStore();
    const before = selectSortedTickets(store.getState());

    store.dispatch(moreTicketsShown());

    expect(selectSortedTickets(store.getState())).toBe(before);
  });
});

describe('show more pagination', () => {
  it('shows 5 tickets first, 6 after "show more", then hides the button', () => {
    const store = createStore();

    expect(selectVisibleTickets(store.getState())).toHaveLength(5);
    expect(selectHasMore(store.getState())).toBe(true);
    expect(selectNextPageSize(store.getState())).toBe(1);

    store.dispatch(moreTicketsShown());

    expect(selectVisibleTickets(store.getState())).toHaveLength(6);
    expect(selectHasMore(store.getState())).toBe(false);
  });

  it('shows 5 again after the sorting changes', () => {
    const store = createStore();
    store.dispatch(moreTicketsShown());

    store.dispatch(sortChanged('fastest'));

    expect(selectVisibleCount(store.getState())).toBe(5);
    expect(selectVisibleTickets(store.getState())).toHaveLength(5);
  });

  it('shows 5 again after the filter changes', () => {
    const store = createStore();
    store.dispatch(moreTicketsShown());

    store.dispatch(stopToggled(0));

    expect(selectVisibleCount(store.getState())).toBe(5);
  });
});
