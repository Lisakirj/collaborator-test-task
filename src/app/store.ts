import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { filtersSlice } from '../features/filters/filtersSlice';
import { sortSlice } from '../features/sort/sortSlice';
import { ticketsSlice } from '../features/tickets/ticketsSlice';
import { paginationSlice } from '../features/pagination/paginationSlice';

const rootReducer = combineSlices(
  filtersSlice,
  sortSlice,
  ticketsSlice,
  paginationSlice,
);

export type RootState = ReturnType<typeof rootReducer>;

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({ reducer: rootReducer, preloadedState });
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
