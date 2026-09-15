import a4eLogo from '../../assets/airline-a4e.png';

export interface Carrier {
  name: string;
  logo: string;
}

const CARRIERS: Readonly<Record<string, Carrier>> = {
  A4E: { name: 'Airlines for Europe', logo: a4eLogo },
};

export function getCarrier(code: string): Carrier | undefined {
  return CARRIERS[code];
}
