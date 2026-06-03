import { create } from 'zustand';
import { AsteroidBeltData, PlanetData, SpaceSystem, StarData } from '../types';

interface SystemStore {
  systems: SpaceSystem[];
  activeSystemId: string | null;
  isPaused: boolean;
  timeScale: number;

  setIsPaused: (paused: boolean) => void;
  setTimeScale: (scale: number) => void;
  setActiveSystem: (id: string | null) => void;
  addSystem: (name: string) => void;
  updateStar: (data: Partial<StarData>) => void;
  addPlanet: (planet: PlanetData) => void;
  updatePlanet: (planetId: string, data: Partial<PlanetData>) => void;
  removePlanet: (planetId: string) => void;
  addBelt: (belt: AsteroidBeltData) => void;
  updateBelt: (beltId: string, data: Partial<AsteroidBeltData>) => void;
  removeBelt: (beltId: string) => void;

  showGrid: boolean;
  showTrails: boolean;
  showOrbits: boolean;
  isSidebarOpen: boolean;
  cameraResetTrigger: number;

  isZenMode: boolean;
  toggleZenMode: () => void;

  hoveredObjectId: string | null;
  setHoveredObject: (id: string | null) => void;

  followTargetId: string | null;
  followTargetTrigger: number;
  setFollowTarget: (id: string | null) => void;

  toggleGrid: () => void;
  toggleTrails: () => void;
  toggleOrbits: () => void;
  toggleSidebar: () => void;
  triggerCameraReset: () => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  systems: [
    {
      id: 'sys-solar',
      name: 'Solar System',
      createdAt: new Date().toLocaleDateString('en-US'),
      star: { name: 'Sun', size: 2.5, color: '#fff4e8', mass: 1 },
      planets: [
        {
          id: 'p-mercury',
          name: 'Mercury',
          type: 'terrestrial',
          mass: 0.055,
          distance: 8,
          speed: 0.16,
          size: 0.2,
          color: '#8c8c8c',
          textureUrl: '/textures/2k_mercury.jpg',
          rotationSpeed: 0.005,
          axialTilt: 0.03,
          orbitalInclination: 0.12,
        },
        {
          id: 'p-venus',
          name: 'Venus',
          type: 'terrestrial',
          mass: 0.81,
          distance: 14,
          speed: 0.12,
          size: 0.48,
          color: '#e3bb76',
          textureUrl: '/textures/2k_venus_surface.jpg',
          rotationSpeed: -0.002, // Venus rotates in the opposite direction!
          axialTilt: 3.1,
          orbitalInclination: 0.06,
        },
        {
          id: 'p-earth',
          name: 'Earth',
          type: 'terrestrial',
          mass: 1,
          distance: 20,
          speed: 0.1,
          size: 0.5,
          color: '#2b82c9',
          rotationSpeed: 0.05,
          axialTilt: 0.4,
          orbitalInclination: 0,
          moons: [
            {
              id: 'm-moon',
              name: 'Moon',
              size: 0.15,
              distance: 1.5,
              speed: 1.2,
              orbitalInclination: 0.1,
              color: '#aaaaaa',
              textureUrl: '/textures/2k_moon.jpg',
            },
          ],
        },
        {
          id: 'p-mars',
          name: 'Mars',
          type: 'terrestrial',
          mass: 0.1,
          distance: 28,
          speed: 0.08,
          size: 0.35,
          color: '#c1440e',
          textureUrl: '/textures/2k_mars.jpg',
          rotationSpeed: 0.048,
          axialTilt: 0.43,
          orbitalInclination: 0.03,
        },
        {
          id: 'p-jupiter',
          name: 'Jupiter',
          type: 'gas_giant',
          mass: 317,
          distance: 55,
          speed: 0.04,
          size: 1.6,
          color: '#d39c7e',
          textureUrl: '/textures/2k_jupiter.jpg',
          rotationSpeed: 0.12,
          axialTilt: 0.05,
          orbitalInclination: 0.02,
          moons: [
            {
              id: 'm-io',
              name: 'Io',
              size: 0.12,
              distance: 2.5,
              speed: 2.5,
              orbitalInclination: 0,
              textureUrl: '/textures/io.jpg',
              color: '#ffffaa',
            },
            {
              id: 'm-europa',
              name: 'Europa',
              size: 0.1,
              distance: 3.5,
              speed: 1.8,
              orbitalInclination: 0,
              color: '#ffffff',
            },
          ],
        },
        {
          id: 'p-saturn',
          name: 'Saturn',
          type: 'gas_giant',
          mass: 95,
          distance: 80,
          speed: 0.03,
          size: 1.3,
          color: '#ead6b8',
          textureUrl: '/textures/2k_saturn.jpg',
          rotationSpeed: 0.11,
          axialTilt: 0.46,
          orbitalInclination: 0.04,
          rings: [
            {
              id: 'r-saturn-1',
              name: 'Ring B',
              innerRadius: 1.2,
              outerRadius: 1.8,
              color: '#d2c0a5',
              opacity: 0.8,
            },
            {
              id: 'r-saturn-2',
              name: 'Ring A',
              innerRadius: 1.85,
              outerRadius: 2.2,
              color: '#e5d3b9',
              opacity: 0.5,
            },
          ],
        },
        {
          id: 'p-uranus',
          name: 'Uranus',
          type: 'gas_giant',
          mass: 14.5,
          distance: 110,
          speed: 0.02,
          size: 1.0,
          color: '#4b70dd',
          textureUrl: '/textures/2k_uranus.jpg',
          rotationSpeed: 0.09,
          axialTilt: 1.71,
          orbitalInclination: 0.01,
          rings: [
            {
              id: 'r-uranus-1',
              name: 'Epsilon Ring',
              innerRadius: 1.5,
              outerRadius: 1.55,
              color: '#ffffff',
              opacity: 0.2,
            },
          ],
        },
        {
          id: 'p-neptune',
          name: 'Neptune',
          type: 'gas_giant',
          mass: 17,
          distance: 140,
          speed: 0.015,
          size: 0.95,
          color: '#274687',
          textureUrl: '/textures/2k_neptune.jpg',
          rotationSpeed: 0.1,
          axialTilt: 0.5,
          orbitalInclination: 0.03,
        },
      ],
      belts: [
        {
          id: 'b-asteroid',
          name: 'Asteroid Belt',
          distance: 38,
          width: 6,
          count: 2500,
          speed: 0.06,
          orbitalInclination: 0.05,
          color: '#665544',
        },
        {
          id: 'b-kuiper',
          name: 'Kuiper Belt',
          distance: 160,
          width: 20,
          count: 4000,
          speed: 0.01,
          orbitalInclination: 0.1,
          color: '#445566',
        },
      ],
    },
    {
      id: 'sys-trappist',
      name: 'TRAPPIST-1',
      createdAt: new Date().toLocaleDateString('en-US'),
      star: { name: 'TRAPPIST-1', size: 0.8, color: '#ff3300', mass: 0.09 },
      planets: [
        {
          id: 'p-t1d',
          name: 'TRAPPIST-1d',
          type: 'terrestrial',
          mass: 0.3,
          distance: 8,
          speed: 0.4,
          size: 0.3,
          color: '#885544',
          textureUrl: '/textures/2k_trappist1d.jpg',
          rotationSpeed: 0.01,
          axialTilt: 0,
          orbitalInclination: 0,
        },
        {
          id: 'p-t1e',
          name: 'TRAPPIST-1e (Habitable)',
          type: 'terrestrial',
          mass: 0.7,
          distance: 11,
          speed: 0.32,
          size: 0.45,
          color: '#446655',
          textureUrl: '/textures/2k_trappist1f.jpg',
          rotationSpeed: 0.01,
          axialTilt: 0.1,
          orbitalInclination: 0.01,
        },
      ],
      belts: [],
    },
    {
      id: 'sys-kepler',
      name: 'Kepler-186',
      createdAt: new Date().toLocaleDateString('en-US'),
      star: { name: 'Kepler-186', size: 1.5, color: '#ffcc88', mass: 0.5 },
      planets: [
        {
          id: 'p-k186f',
          name: 'Kepler-186f',
          type: 'terrestrial',
          mass: 1.4,
          distance: 35,
          speed: 0.15,
          size: 0.6,
          color: '#55aa55',
          textureUrl: '/textures/2k_trappist1f.jpg',
          rotationSpeed: 0.04,
          axialTilt: 0.3,
          orbitalInclination: 0,
        },
      ],
      belts: [],
    },
  ],
  activeSystemId: 'sys-solar',
  isPaused: false,
  timeScale: 1,

  showGrid: true,
  showTrails: true,
  showOrbits: true,
  isSidebarOpen: true,
  cameraResetTrigger: 0,
  isZenMode: false,
  hoveredObjectId: null,
  followTargetId: null,
  followTargetTrigger: 0,

  setHoveredObject: (id) => set({ hoveredObjectId: id }),
  setFollowTarget: (id) =>
    set((state) => ({ followTargetId: id, followTargetTrigger: state.followTargetTrigger + 1 })),
  toggleZenMode: () =>
    set((state) => ({
      isZenMode: !state.isZenMode,
      isSidebarOpen: state.isZenMode ? true : false,
    })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleTrails: () => set((state) => ({ showTrails: !state.showTrails })),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  triggerCameraReset: () => set((state) => ({ cameraResetTrigger: state.cameraResetTrigger + 1 })),

  setIsPaused: (paused) => set({ isPaused: paused }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  setActiveSystem: (id) => set({ activeSystemId: id }),
  addSystem: (name) =>
    set((state) => {
      const newSystem: SpaceSystem = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toLocaleDateString('uk-UA'),
        star: { name: 'Нова Зірка', size: 1, color: '#ffffff', mass: 1 },
        planets: [],
        belts: [],
      };
      return { systems: [...state.systems, newSystem], activeSystemId: newSystem.id };
    }),
  updateStar: (data) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId ? { ...sys, star: { ...sys.star, ...data } } : sys,
      ),
    })),
  addPlanet: (planet) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId ? { ...sys, planets: [...sys.planets, planet] } : sys,
      ),
    })),
  updatePlanet: (planetId, data) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId
          ? { ...sys, planets: sys.planets.map((p) => (p.id === planetId ? { ...p, ...data } : p)) }
          : sys,
      ),
    })),
  removePlanet: (planetId) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId
          ? { ...sys, planets: sys.planets.filter((p) => p.id !== planetId) }
          : sys,
      ),
    })),
  addBelt: (belt) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId ? { ...sys, belts: [...sys.belts, belt] } : sys,
      ),
    })),
  updateBelt: (beltId, data) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId
          ? { ...sys, belts: sys.belts.map((b) => (b.id === beltId ? { ...b, ...data } : b)) }
          : sys,
      ),
    })),
  removeBelt: (beltId) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId
          ? { ...sys, belts: sys.belts.filter((b) => b.id !== beltId) }
          : sys,
      ),
    })),
}));
