import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { parseTickets } from './parseTickets';
import type { Ticket } from './types';

export type TicketsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface TicketsState {
  items: Ticket[];
  status: TicketsStatus;
  error: string | null;
}

const initialState: TicketsState = {
  items: [],
  status: 'idle',
  error: null,
};

const TICKETS_URL = `${import.meta.env.BASE_URL}data/tickets.json`;

export const fetchTickets = createAsyncThunk<
  Ticket[],
  undefined,
  { state: RootState; rejectValue: string }
>(
  'tickets/fetch',
  async (_, { signal, rejectWithValue }) => {
    const response = await fetch(TICKETS_URL, { signal });
    if (!response.ok) {
      return rejectWithValue(`Сервер відповів зі статусом ${response.status}`);
    }
    return parseTickets(await response.json());
  },
  {
    // Skip if loading or data is already loaded
    condition: (_, { getState }) => {
      const { status } = getState().tickets;
      return status === 'idle' || status === 'failed';
    },
  },
);

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? action.error.message ?? 'Невідома помилка';
      });
  },
  selectors: {
    selectTicketItems: (state) => state.items,
    selectTicketsStatus: (state) => state.status,
  },
});

export const { selectTicketItems, selectTicketsStatus } =
  ticketsSlice.selectors;
