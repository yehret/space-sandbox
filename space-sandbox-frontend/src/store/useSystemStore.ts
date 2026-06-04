import { create } from 'zustand';
import { api } from '../api/client';
import { AsteroidBeltData, PlanetData, SpaceSystem, StarData } from '../types';

interface SystemStore {
  systems: SpaceSystem[];
  activeSystemId: string | null;

  fetchSystems: () => Promise<void>;
  createSystem: (name: string) => Promise<void>;
  saveActiveSystem: () => Promise<void>;
  deleteSystem: (id: string) => Promise<void>;
  cloneSystem: (id: string) => Promise<void>;
  toggleSystemVisibility: (id: string, isPublic: boolean) => Promise<void>;

  setActiveSystem: (id: string | null) => void;
  updateStar: (data: Partial<StarData>) => void;
  addPlanet: (planet: PlanetData) => void;
  updatePlanet: (planetId: string, data: Partial<PlanetData>) => void;
  removePlanet: (planetId: string) => void;
  addBelt: (belt: AsteroidBeltData) => void;
  updateBelt: (beltId: string, data: Partial<AsteroidBeltData>) => void;
  removeBelt: (beltId: string) => void;
  updateSystemName: (name: string) => void;

  isPaused: boolean;
  timeScale: number;
  showGrid: boolean;
  showTrails: boolean;
  showOrbits: boolean;
  isSidebarOpen: boolean;
  cameraResetTrigger: number;
  isZenMode: boolean;
  hoveredObjectId: string | null;
  followTargetId: string | null;
  followTargetTrigger: number;

  setIsPaused: (paused: boolean) => void;
  setTimeScale: (scale: number) => void;
  toggleZenMode: () => void;
  setHoveredObject: (id: string | null) => void;
  setFollowTarget: (id: string | null) => void;
  toggleGrid: () => void;
  toggleTrails: () => void;
  toggleOrbits: () => void;
  toggleSidebar: () => void;
  triggerCameraReset: () => void;
}

export const useSystemStore = create<SystemStore>((set, get) => ({
  systems: [],
  activeSystemId: null,

  fetchSystems: async () => {
    try {
      const response = await api.get('/systems');
      set({ systems: response.data });
    } catch (error) {
      console.error('Failed to fetch systems:', error);
    }
  },

  createSystem: async (name) => {
    try {
      const response = await api.post('/systems', { name });
      const newSystem = response.data;
      set((state) => ({
        systems: [...state.systems, newSystem],
        activeSystemId: newSystem.id,
      }));
    } catch (error) {
      console.error('Failed to create system:', error);
    }
  },

  saveActiveSystem: async () => {
    const { activeSystemId, systems } = get();
    if (!activeSystemId) return;

    const systemToSave = systems.find((s) => s.id === activeSystemId);
    if (!systemToSave) return;

    try {
      await api.put(`/systems/${activeSystemId}`, systemToSave);
      console.log('System saved successfully!');
    } catch (error) {
      console.error('Failed to save system:', error);
    }
  },

  deleteSystem: async (id) => {
    try {
      await api.delete(`/systems/${id}`);
      set((state) => ({
        systems: state.systems.filter((sys) => sys.id !== id),
        activeSystemId: state.activeSystemId === id ? null : state.activeSystemId,
      }));
    } catch (error) {
      console.error('Failed to delete system:', error);
    }
  },

  cloneSystem: async (id) => {
    api.post(`/systems/${id}/clone`);
    console.warn('Clone endpoint needed on backend');
  },

  updateSystemName: (name) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId ? { ...sys, name } : sys,
      ),
    })),

  setActiveSystem: (id) => set({ activeSystemId: id, followTargetId: null }),

  updateStar: (data) =>
    set((state) => ({
      systems: state.systems.map((sys) =>
        sys.id === state.activeSystemId && sys.star
          ? { ...sys, star: { ...sys.star, ...data } }
          : sys,
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

  toggleSystemVisibility: async (id, isPublic) => {
    try {
      await api.patch(`/systems/${id}/visibility`, { isPublic });
      set((state) => ({
        systems: state.systems.map((sys) => (sys.id === id ? { ...sys, isPublic } : sys)),
      }));
    } catch (error) {
      console.error('Failed to change visibility:', error);
    }
  },

  // ==========================================
  // СТАН UI
  // ==========================================

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
}));
