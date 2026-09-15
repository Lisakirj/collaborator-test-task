import type { Ticket } from '../features/tickets/types';

const toMinutes = (hours: number, minutes: number) => hours * 60 + minutes;

function createTicket(
  id: string,
  price: number,
  [outbound, inbound]: [number, number],
  stops: string[],
): Ticket {
  return {
    id,
    price,
    carrier: 'A4E',
    segments: [
      {
        origin: 'LHR',
        destination: 'DXB',
        date: '2026-10-01T10:45:00Z',
        duration: outbound,
        stops,
      },
      {
        origin: 'DXB',
        destination: 'LHR',
        date: '2026-10-15T11:20:00Z',
        duration: inbound,
        stops: [...stops],
      },
    ],
  };
}

// Reference set from the requirements: durations are for outbound + return
export const T1 = createTicket(
  'T1',
  13300,
  [toMinutes(34, 15), toMinutes(16, 30)],
  ['HKG'],
);
export const T2 = createTicket(
  'T2',
  15100,
  [toMinutes(17, 15), toMinutes(40, 30)],
  ['HKG', 'JNB'],
);
export const T3 = createTicket(
  'T3',
  15400,
  [toMinutes(20, 15), toMinutes(13, 30)],
  ['HKG'],
);
export const T4 = createTicket(
  'T4',
  21400,
  [toMinutes(21, 15), toMinutes(12, 30)],
  ['HKG', 'JNB', 'DOH'],
);
export const T5 = createTicket(
  'T5',
  23900,
  [toMinutes(11, 15), toMinutes(9, 30)],
  [],
);
export const T6 = createTicket(
  'T6',
  12000,
  [toMinutes(20, 0), toMinutes(13, 45)],
  ['HKG', 'JNB'],
);

export const CONTROL_TICKETS: readonly Ticket[] = [T1, T2, T3, T4, T5, T6];

export const ids = (tickets: readonly Ticket[]) =>
  tickets.map((ticket) => ticket.id);
