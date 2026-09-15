import { STOPS_COUNTS, type Segment, type Ticket } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

function isSegment(value: unknown): value is Segment {
  return (
    isRecord(value) &&
    isNonEmptyString(value.origin) &&
    isNonEmptyString(value.destination) &&
    typeof value.date === 'string' &&
    !Number.isNaN(Date.parse(value.date)) &&
    isPositiveInteger(value.duration) &&
    Array.isArray(value.stops) &&
    value.stops.every(isNonEmptyString)
  );
}

// Requirement: both directions have the same number of stops, and it is allowed
export function hasConsistentStops(segments: readonly Segment[]): boolean {
  const count = segments[0]?.stops.length;
  return (
    STOPS_COUNTS.some((allowed) => allowed === count) &&
    segments.every((segment) => segment.stops.length === count)
  );
}

function isTicket(value: unknown): value is Ticket {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isPositiveInteger(value.price) &&
    isNonEmptyString(value.carrier) &&
    Array.isArray(value.segments) &&
    value.segments.length === 2 &&
    value.segments.every(isSegment) &&
    hasConsistentStops(value.segments)
  );
}

// Checks that the server response matches Ticket[]
export function parseTickets(data: unknown): Ticket[] {
  if (!Array.isArray(data)) {
    throw new TypeError('Expected an array of tickets');
  }
  if (!data.every(isTicket)) {
    const index = data.findIndex((item) => !isTicket(item));
    throw new TypeError(`Ticket #${index + 1} does not match the data format`);
  }
  return data;
}
