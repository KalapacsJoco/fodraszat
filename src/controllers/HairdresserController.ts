import { Hairdresser } from '../models/Hairdresser';
import { HAIRDRESSERS_URL } from '../apiConfig.js';

export async function getHairdressers(): Promise<Hairdresser[]> {
  const response = await fetch(HAIRDRESSERS_URL);
  return await response.json();
}

