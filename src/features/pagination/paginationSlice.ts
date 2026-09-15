import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { allStopsToggled, stopToggled } from '../filters/filtersSlice';
import { sortChanged } from '../sort/sortSlice';

export const PAGE_SIZE = 5;

interface PaginationState {
  visibleCount: number;
}

const initialState: PaginationState = {
  visibleCount: PAGE_SIZE,
};

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    moreTicketsShown(state) {
      state.visibleCount += PAGE_SIZE;
    },
  },
  extraReducers: (builder) => {
    // New filter or sort resets the list to the first batch
    builder.addMatcher(
      isAnyOf(stopToggled, allStopsToggled, sortChanged),
      () => initialState,
    );
  },
  selectors: {
    selectVisibleCount: (state) => state.visibleCount,
  },
});

export const { moreTicketsShown } = paginationSlice.actions;
export const { selectVisibleCount } = paginationSlice.selectors;
