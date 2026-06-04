import { create } from 'zustand';

interface UIState {
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

export const useUIStore = create<UIState>((set) => ({
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

  setIsPaused: (paused) => set({ isPaused: paused }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  setHoveredObject: (id) => set({ hoveredObjectId: id }),
  setFollowTarget: (id) =>
    set((state) => ({ followTargetId: id, followTargetTrigger: state.followTargetTrigger + 1 })),
  toggleZenMode: () =>
    set((state) => ({ isZenMode: !state.isZenMode, isSidebarOpen: state.isZenMode })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleTrails: () => set((state) => ({ showTrails: !state.showTrails })),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  triggerCameraReset: () => set((state) => ({ cameraResetTrigger: state.cameraResetTrigger + 1 })),
}));
