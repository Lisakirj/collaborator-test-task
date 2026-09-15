export const STOPS_COUNTS = [0, 1, 2, 3] as const;

export type StopsCount = (typeof STOPS_COUNTS)[number];

export interface Segment {
  origin: string; // IATA code of the departure airport, e.g. "LHR"
  destination: string; //IATA code of the arrival airport, e.g. "DXB"
  date: string; // Date and time of departure in UTC (ISO 8601). The time of arrival is not saved, but calculated
  duration: number; // Flight duration in minutes
  stops: string[]; //IATA codes of the transfer airports
}

export interface Ticket {
  id: string;
  price: number; // Price in dollars, integer number
  carrier: string; // IATA code of the airline
  segments: [Segment, Segment]; // [there, back]
}
