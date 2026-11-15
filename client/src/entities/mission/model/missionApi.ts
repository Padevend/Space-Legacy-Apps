import { Mission } from './types';

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 'm-apollo-11',
    name: 'Apollo 11',
    rating: 9.9,
    location: 'lune',
  },
  {
    id: 'm-mer-b',
    name: 'Mars Exploration Rover - Opportunity',
    rating: 9.8,
    location: 'mars',
  },
  {
    id: 'm-mars-2020',
    name: 'Mars 2020 (Perseverance & Ingenuity)',
    rating: 9.7,
    location: 'mars',
  },
  {
    id: 'm-viking-1',
    name: 'Viking 1',
    rating: 9.5,
    location: 'mars',
  },
  {
    id: 'm-surveyor-3',
    name: 'Surveyor 3',
    rating: 9.2,
    location: 'lune',
  },
];

export async function fetchMissions(): Promise<Mission[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return MOCK_MISSIONS;
}
