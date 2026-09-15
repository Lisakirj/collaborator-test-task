import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { areAllStopsSelected } from '../../utils/filterTickets';
import { STOPS_COUNTS, type StopsCount } from '../tickets/types';

interface FiltersState {
  stops: StopsCount[];
}

// By default, "Всі" is selected, so that the user can see tickets immediately when the page is opened
const initialState: FiltersState = {
  stops: [...STOPS_COUNTS],
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    stopToggled(state, action: PayloadAction<StopsCount>) {
      const count = action.payload;
      state.stops = state.stops.includes(count)
        ? state.stops.filter((selected) => selected !== count)
        : [...state.stops, count].sort((a, b) => a - b);
    },
    allStopsToggled(state) {
      state.stops = areAllStopsSelected(state.stops) ? [] : [...STOPS_COUNTS];
    },
  },
  selectors: {
    selectSelectedStops: (state) => state.stops,
  },
});

export const { stopToggled, allStopsToggled } = filtersSlice.actions;
export const { selectSelectedStops } = filtersSlice.selectors;
