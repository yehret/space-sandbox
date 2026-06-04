import { useShallow } from 'zustand/shallow';
import { useAuthStore } from '../../store/useAuthStore';
import { useSystemStore } from '../../store/useSystemStore';
import { useUIStore } from '../../store/useUiStore';

export const SystemEditor = ({
  onEditPlanet,
  onEditStar,
  onEditBelt,
}: {
  onEditPlanet: (id: string) => void;
  onEditStar: () => void;
  onEditBelt: (id: string) => void;
}) => {
  const { systems, activeSystemId, addPlanet, addBelt } = useSystemStore(
    useShallow((state) => ({
      systems: state.systems,
      activeSystemId: state.activeSystemId,
      addPlanet: state.addPlanet,
      addBelt: state.addBelt,
    })),
  );
  const setFollowTarget = useUIStore((state) => state.setFollowTarget);

  const { user } = useAuthStore();
  const activeSystem = activeSystemId ? systems[activeSystemId] : null;
  const planets = activeSystem?.planets || [];
  const star = activeSystem?.star;
  const belts = activeSystem?.belts || [];

  const isOwner = user !== null && activeSystem?.authorId === user.id;

  const handleAddNewPlanet = () => {
    const newId = crypto.randomUUID();
    addPlanet({
      id: newId,
      name: 'New Planet',
      type: 'terrestrial',
      mass: 1,
      size: 1,
      distance: 30,
      speed: 0.1,
      orbitalInclination: 0,
      rotationSpeed: 0.01,
      axialTilt: 0,
      color: '#4ade80',
    });
    onEditPlanet(newId);
    //  setIsPaused(true);
  };

  const handleAddNewBelt = () => {
    const newId = crypto.randomUUID();
    addBelt({
      id: newId,
      name: 'New Belt',
      distance: 40,
      width: 5,
      count: 1000,
      speed: 0.05,
      orbitalInclination: 0,
      color: '#887766',
    });
    onEditBelt(newId);
    //  setIsPaused(true);
  };

  return (
    <>
      <div className="p-3 lg:p-4 border-b border-white/10 bg-white/5 shrink-0">
        <h2 className="text-base lg:text-lg font-bold">Star</h2>
      </div>

      <div className="p-3 lg:p-4 border-b border-white/10 shrink-0">
        <div
          onClick={() => onEditStar()}
          className="p-2 lg:p-3 bg-orange-500/10 hover:bg-orange-500/20 transition-colors rounded-xl border border-orange-500/30 cursor-pointer flex items-center gap-3 lg:gap-4 shadow-[inset_0_0_15px_rgba(249,115,22,0.1)]">
          <div
            className="w-4 h-4 lg:w-5 lg:h-5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            style={{ backgroundColor: star?.color || '#FDB813' }}
          />
          <div className="flex flex-col">
            <span className="font-bold text-orange-50 text-sm lg:text-base">{star?.name}</span>
            <span className="text-[10px] lg:text-xs text-orange-200/50 uppercase tracking-wider">
              Star
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 lg:p-4 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
        <h2 className="text-base lg:text-lg font-bold">System Objects</h2>
        <span className="text-[10px] lg:text-xs text-white/50">
          {planets.length + belts.length} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 lg:p-4 flex flex-col gap-2 min-h-0 custom-scrollbar">
        {planets.map((planet) => (
          <div
            key={planet.id}
            onClick={() => {
              setFollowTarget(planet.id);
              onEditPlanet(planet.id);
            }}
            className="p-2 lg:p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/5 cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <div
                className="w-3 h-3 lg:w-4 lg:h-4 rounded-full"
                style={{ backgroundColor: planet.color }}
              />
              <span className="font-medium text-sm lg:text-base">{planet.name}</span>
            </div>
            <span className="text-[9px] lg:text-[10px] text-white/30 uppercase">Planet</span>
          </div>
        ))}

        {belts.map((belt) => (
          <div
            key={belt.id}
            onClick={() => onEditBelt(belt.id)}
            className="p-2 lg:p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/5 cursor-pointer flex items-center justify-between border-dashed">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-3 h-3 lg:w-4 lg:h-4 flex flex-wrap gap-[1px] lg:gap-0.5 opacity-70">
                <div
                  className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full"
                  style={{ backgroundColor: belt.color }}
                />
                <div
                  className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full"
                  style={{ backgroundColor: belt.color }}
                />
                <div
                  className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full"
                  style={{ backgroundColor: belt.color }}
                />
              </div>
              <span className="font-medium text-gray-300 text-sm lg:text-base">{belt.name}</span>
            </div>
            <span className="text-[9px] lg:text-[10px] text-white/30 uppercase">Belt</span>
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="p-3 lg:p-4 border-t border-white/10 flex gap-2 shrink-0">
          <button
            onClick={handleAddNewPlanet}
            className="flex-1 py-2 lg:py-3 text-sm lg:text-base bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl font-semibold shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            + Planet
          </button>
          <button
            onClick={handleAddNewBelt}
            className="flex-1 py-2 lg:py-3 text-sm lg:text-base bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-semibold text-gray-300">
            + Belt
          </button>
        </div>
      )}
    </>
  );
};
