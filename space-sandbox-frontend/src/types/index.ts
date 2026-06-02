export type StarData = {
  name: string;
  size: number;
  color: string;
  mass: number;
};

export type MoonData = {
  id: string;
  name: string;
  size: number;
  distance: number;
  speed: number;
  orbitalInclination: number;
  color: string;
};

export type PlanetaryRingData = {
  id: string;
  name: string;
  innerRadius: number;
  outerRadius: number;
  color: string;
  opacity: number;
};

export type PlanetData = {
  id: string;
  name: string;
  type: string;
  mass: number;
  size: number;
  distance: number;
  speed: number;
  orbitalInclination: number;
  rotationSpeed: number;
  axialTilt: number;
  color: string;
  textureUrl?: string;

  moons?: MoonData[];
  rings?: PlanetaryRingData[];
};

export type AsteroidBeltData = {
  id: string;
  name: string;
  distance: number;
  width: number;
  count: number;
  speed: number;
  orbitalInclination: number;
  color: string;
};

export type SpaceSystem = {
  id: string;
  name: string;
  createdAt: string;
  star: StarData;
  planets: PlanetData[];
  belts: AsteroidBeltData[];
};
