// src/entities/mission/model/types.ts
export interface Mission {
  id: string;
  name: string;
  rating: number; // out of 10
  location: string; // e.g., "mars" or "lune"
}
