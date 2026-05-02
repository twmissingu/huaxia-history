export interface City {
  name: string;
  coordinates: [number, number];
  type: 'capital' | 'major' | 'battlefield' | 'site';
  description: string;
}

export interface Dynasty {
  id: string;
  name: string;
  shortName: string;
  period: string;
  startYear: number;
  endYear: number;
  capital: string;
  capitalCoordinates: [number, number];
  color: string;
  secondaryColor: string;
  richness: 'thin' | 'medium' | 'rich';
  overview: string;
  heroImage: string;
  tagline: string;
  cities?: City[];
}

export interface HistoricalEvent {
  id: string;
  year: number;
  month?: number;
  day?: number;
  title: string;
  dynasty: string;
  category: 'politics' | 'military' | 'culture' | 'technology';
  location: string;
  coordinates?: [number, number];
  description: string;
  significance: string;
  relatedFigures: string[];
  image?: string;
}

export interface HistoricalFigure {
  id: string;
  name: string;
  courtesyName?: string;
  artName?: string;
  dynasty: string;
  birthYear: number;
  deathYear: number;
  birthplace: string;
  titles: string[];
  category: string[];
  tags: string[];
  bio: string;
  achievements: string[];
  works?: string[];
  relations: Relation[];
  image?: string;
  quote?: string;
}

export interface Relation {
  figureId: string;
  figureName: string;
  type: 'friend' | 'enemy' | 'family' | 'teacher' | 'student' | 'colleague';
  description: string;
}

export interface Location {
  id: string;
  ancientName: string;
  modernName: string;
  coordinates: [number, number];
  type: 'capital' | 'city' | 'pass' | 'battlefield' | 'site';
  dynasty: string;
  description: string;
}

export interface HistoricalRoute {
  id: string;
  name: string;
  nameEn: string;
  period: string;
  type: 'trade' | 'military' | 'diplomatic' | 'migration';
  coordinates: [number, number][];
  waypoints: {
    name: string;
    coordinates: [number, number];
    description: string;
  }[];
  description: string;
}

export interface Territory {
  dynasty: string;
  year: number;
  geojson: GeoJSON.Polygon;
  maxExtent: boolean;
}

export type EventCategory = 'politics' | 'military' | 'culture' | 'technology';

export const categoryLabels: Record<EventCategory, string> = {
  politics: '政治',
  military: '军事',
  culture: '文化',
  technology: '科技',
};

export const categoryColors: Record<EventCategory, string> = {
  politics: '#c9372c',
  military: '#8b0000',
  culture: '#4682b4',
  technology: '#228b22',
};
