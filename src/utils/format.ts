import type { Segment } from '../features/tickets/types';
import { pluralize } from './plural';
import { getArrivalDate } from './ticket';

const NBSP = '\u00A0';
const EN_DASH = '\u2013';
const MINUTES_IN_HOUR = 60;

const priceFormatter = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 0,
});

const padTwoDigits = (value: number): string => String(value).padStart(2, '0');

// 13300 → 13 300 $
export const formatPrice = (price: number): string => {
  return `${priceFormatter.format(price)}${NBSP}$`;
};

// HH:MM time in UTC — the same regardless of the user's time zone
export const formatTime = (date: Date): string => {
  return `${padTwoDigits(date.getUTCHours())}:${padTwoDigits(date.getUTCMinutes())}`;
};

// 2055 --> "34г 15хв", 545 --> "9г 05хв"
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / MINUTES_IN_HOUR);
  return `${hours}г ${padTwoDigits(minutes % MINUTES_IN_HOUR)}хв`;
}

// "LHR – DXB", "10:45 – 08:00"
export const formatRange = (from: string, to: string): string => {
  return `${from} ${EN_DASH} ${to}`;
};

// 0 --> "Без пересадок", 1 --> "1 пересадка", 2 --> "2 пересадки", 5 --> "5 пересадок"
export const formatStopsCount = (count: number): string => {
  if (count === 0) return 'Без пересадок';
  return `${count} ${pluralize(count, { one: 'пересадка', few: 'пересадки', many: 'пересадок' })}`;
};

const TICKET_FORMS = { one: 'квиток', few: 'квитки', many: 'квитків' };

// 5 --> "Показати ще 5 квитків", 3 --> "Показати ще 3 квитки", 1 --> "Показати ще 1 квиток"
export const formatShowMoreLabel = (count: number): string => {
  return `Показати ще ${count} ${pluralize(count, TICKET_FORMS)}`;
};

export const NO_RESULTS_MESSAGE =
  'Рейсів, що відповідають заданим фільтрам, не знайдено';

// Announcement for screen readers: "Знайдено 12 квитків" or "Рейсів, що відповідають заданим фільтрам, не знайдено"
export const formatFoundLabel = (count: number): string => {
  if (count === 0) return NO_RESULTS_MESSAGE;
  return `Знайдено ${count} ${pluralize(count, TICKET_FORMS)}`;
};

// Ready-to-display strings for one flight ticket direction
export interface SegmentView {
  route: string; //"LHR – DXB"
  time: string; //“10:45 – 08:00”: departure and calculated arrival time in UTC
  duration: string; //"34г 15хв"
  stopsLabel: string; //"1 пересадка" or "Без пересадок"
  stopsList: string | null; //“HKG, JNB”; `null` for a non-stop flight — the value is not displayed in that case
}

export const toSegmentView = (segment: Segment): SegmentView => {
  return {
    route: formatRange(segment.origin, segment.destination),
    time: formatRange(
      formatTime(new Date(segment.date)),
      formatTime(getArrivalDate(segment)),
    ),
    duration: formatDuration(segment.duration),
    stopsLabel: formatStopsCount(segment.stops.length),
    stopsList: segment.stops.length > 0 ? segment.stops.join(', ') : null,
  };
};
