import { describe, expect, it } from 'vitest';
import ticketsJson from '../../../public/data/tickets.json';
import { getStopsCount } from '../../utils/ticket';
import { parseTickets } from './parseTickets';
import { STOPS_COUNTS } from './types';

// Check the file loaded by the app
const tickets = parseTickets(ticketsJson);

const MOCKUP_TICKETS = [
  { price: 13300, durations: [2055, 990], stops: 1 },
  { price: 15100, durations: [1035, 2430], stops: 2 },
  { price: 15400, durations: [1215, 810], stops: 1 },
  { price: 21400, durations: [1275, 750], stops: 3 },
  { price: 23900, durations: [675, 570], stops: 0 },
];

describe('public/data/tickets.json', () => {
  it('every ticket has the same number of stops in both directions', () => {
    for (const { id, segments } of tickets) {
      expect(segments[1].stops, `ticket ${id}`).toHaveLength(
        segments[0].stops.length,
      );
    }
  });

  it('contains 25-30 tickets spread evenly across the stop counts', () => {
    const perStopsCount = STOPS_COUNTS.map(
      (count) =>
        tickets.filter((ticket) => getStopsCount(ticket) === count).length,
    );

    expect(tickets.length).toBeGreaterThanOrEqual(25);
    expect(tickets.length).toBeLessThanOrEqual(30);
    expect(
      Math.max(...perStopsCount) - Math.min(...perStopsCount),
    ).toBeLessThanOrEqual(1);
  });

  it.each(MOCKUP_TICKETS)(
    'contains the $price $ ticket from the design with the same durations and stops',
    ({ price, durations, stops }) => {
      const ticket = tickets.find((candidate) => candidate.price === price);

      expect(ticket?.segments.map((segment) => segment.duration)).toEqual(
        durations,
      );
      expect(ticket?.segments.map((segment) => segment.stops.length)).toEqual([
        stops,
        stops,
      ]);
    },
  );

  it('has unique ids', () => {
    expect(new Set(tickets.map((ticket) => ticket.id)).size).toBe(
      tickets.length,
    );
  });

  it('flies LHR -> DXB outbound and DXB -> LHR back', () => {
    for (const {
      segments: [outbound, inbound],
    } of tickets) {
      expect([
        outbound.origin,
        outbound.destination,
        inbound.origin,
        inbound.destination,
      ]).toEqual(['LHR', 'DXB', 'DXB', 'LHR']);
    }
  });
});
