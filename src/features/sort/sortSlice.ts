import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SortOption } from '../../utils/sortTickets'

interface SortState {
  by: SortOption
}

const initialState: SortState = {
  by: 'cheapest',
}

export const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    sortChanged(state, action: PayloadAction<SortOption>) {
      state.by = action.payload
    },
  },
  selectors: {
    selectSortBy: (state) => state.by,
  },
})

export const { sortChanged } = sortSlice.actions
export const { selectSortBy } = sortSlice.selectors
