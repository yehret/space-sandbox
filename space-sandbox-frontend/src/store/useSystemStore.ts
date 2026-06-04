import { create } from 'zustand';
import { api } from '../api/client';
import { AsteroidBeltData, PlanetData, SpaceSystem, StarData } from '../types';
import { useUIStore } from './useUIStore';

interface SystemStore {
  systems: Record<string, SpaceSystem>;
  activeSystemId: string | null;
  isLoading: boolean;

  fetchSystems: () => Promise<void>;
  fetchSystemById: (id: string) => Promise<void>;
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
}

export const useSystemStore = create<SystemStore>((set, get) => ({
  systems: {},
  activeSystemId: null,
  isLoading: false,

  fetchSystems: async () => {
    try {
      const response = await api.get('/systems');
      const systemsObj = response.data.reduce(
        (acc: Record<string, SpaceSystem>, sys: SpaceSystem) => {
          acc[sys.id] = sys;
          return acc;
        },
        {},
      );
      set({ systems: systemsObj });
    } catch (error) {
      console.error('Failed to fetch systems:', error);
    }
  },

  fetchSystemById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/systems/${id}`);
      set((state) => ({
        systems: { ...state.systems, [id]: response.data },
        activeSystemId: id,
      }));
    } catch (error) {
      console.error('Failed to fetch system:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createSystem: async (name) => {
    try {
      const response = await api.post('/systems', { name });
      const newSystem = response.data;
      set((state) => ({
        systems: { ...state.systems, [newSystem.id]: newSystem },
        activeSystemId: newSystem.id,
      }));
    } catch (error) {
      console.error('Failed to create system:', error);
    }
  },

  saveActiveSystem: async () => {
    const { activeSystemId, systems } = get();
    if (!activeSystemId || !systems[activeSystemId]) return;

    try {
      await api.put(`/systems/${activeSystemId}`, systems[activeSystemId]);
    } catch (error) {
      console.error('Failed to save system:', error);
    }
  },

  deleteSystem: async (id) => {
    try {
      await api.delete(`/systems/${id}`);
      set((state) => {
        const newSystems = { ...state.systems };
        delete newSystems[id];
        return {
          systems: newSystems,
          activeSystemId: state.activeSystemId === id ? null : state.activeSystemId,
        };
      });
    } catch (error) {
      console.error('Failed to delete system:', error);
    }
  },

  cloneSystem: async (id: string) => {
    try {
      const response = await api.post(`/systems/${id}/clone`);
      const clonedSystem = response.data;

      set((state) => ({
        systems: {
          ...state.systems,
          [clonedSystem.id]: clonedSystem,
        },
        activeSystemId: clonedSystem.id,
      }));
    } catch (error) {
      console.error('Failed to clone system:', error);
    }
  },

  updateSystemName: (name) =>
    set((state) => {
      const id = state.activeSystemId;
      if (!id || !state.systems[id]) return state;
      return {
        systems: { ...state.systems, [id]: { ...state.systems[id], name } },
      };
    }),

  setActiveSystem: (id) => {
    set({ activeSystemId: id });
    useUIStore.getState().setFollowTarget(null);
  },

  updateStar: (data) =>
    set((state) => {
      const id = state.activeSystemId;
      if (!id || !state.systems[id]) return state;
      const sys = state.systems[id];
      return {
        systems: { ...state.systems, [id]: { ...sys, star: { ...sys.star, ...data } } },
      };
    }),

  addPlanet: (planet) =>
    set((state) => {
      const id = state.activeSystemId;
      if (!id || !state.systems[id]) return state;
      const sys = state.systems[id];
      return {
        systems: { ...state.systems, [id]: { ...sys, planets: [...sys.planets, planet] } },
      };
    }),

  updatePlanet: (planetId, data) =>
    set((state) => {
      const id = state.activeSystemId;
      if (!id || !state.systems[id]) return state;
      const sys = state.systems[id];
      return {
        systems: {
          ...state.systems,
          [id]: {
            ...sys,
            planets: sys.planets.map((p) => (p.id === planetId ? { ...p, ...data } : p)),
          },
        },
      };
    }),

  removePlanet: (planetId) =>
    set((state) => {
      const id = state.activeSystemId;
      if (!id || !state.systems[id]) return state;
      const sys = state.systems[id];
      return {
        systems: {
          ...state.systems,
          [id]: { ...sys, planets: sys.planets.filter((p) => p.id !== planetId) },
        },
      };
    }),

  addBelt: (belt) =>
    set((state) => {
      const id = state.activeSystemId;
      if (!id || !state.systems[id]) return state;
      const sys = state.systems[id];
      return {
        systems: { ...state.systems, [id]: { ...sys, belts: [...sys.belts, belt] } },
      };
    }),

  updateBelt: (beltId, data) =>
    set((state) => {
      const id = state.activeSystemId;
      if (!id || !state.systems[id]) return state;
      const sys = state.systems[id];
      return {
        systems: {
          ...state.systems,
          [id]: { ...sys, belts: sys.belts.map((b) => (b.id === beltId ? { ...b, ...data } : b)) },
        },
      };
    }),

  removeBelt: (beltId) =>
    set((state) => {
      const id = state.activeSystemId;
      if (!id || !state.systems[id]) return state;
      const sys = state.systems[id];
      return {
        systems: {
          ...state.systems,
          [id]: { ...sys, belts: sys.belts.filter((b) => b.id !== beltId) },
        },
      };
    }),

  toggleSystemVisibility: async (id, isPublic) => {
    try {
      await api.patch(`/systems/${id}/visibility`, { isPublic });
      set((state) => ({
        systems: { ...state.systems, [id]: { ...state.systems[id], isPublic } },
      }));
    } catch (error) {
      console.error('Failed to change visibility:', error);
    }
  },
}));
