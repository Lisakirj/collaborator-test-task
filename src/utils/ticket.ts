import type { Segment, Ticket } from '../features/tickets/types';

const MS_IN_MINUTE = 60_000;

// The number of stops of a ticket. According to the requirements, it is the same in both directions, so it is enough to take the first segment
export const getStopsCount = (ticket: Ticket): number => {
  return ticket.segments[0].stops.length;
};

// The total flight time there and back, in minutes
export const getTotalDuration = (ticket: Ticket): number => {
  return ticket.segments.reduce(
    (total, segment) => total + segment.duration,
    0,
  );
};

// The arrival time: departure + flight duration
export const getArrivalDate = (segment: Segment): Date => {
  return new Date(Date.parse(segment.date) + segment.duration * MS_IN_MINUTE);
};
