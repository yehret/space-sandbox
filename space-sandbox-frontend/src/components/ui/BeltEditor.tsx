import { useSystemStore } from '../../store/useSystemStore';
import { Slider } from './Slider';

export default function BeltEditor({ beltId, onClose }: { beltId: string; onClose: () => void }) {
  const { systems, activeSystemId, updateBelt, removeBelt, setIsPaused } = useSystemStore();

  const activeSystem = systems.find((s) => s.id === activeSystemId);
  const belt = activeSystem?.belts.find((b) => b.id === beltId);

  if (!belt) return null;

  const handleClose = () => {
    onClose();
    //  setIsPaused(false);
  };

  const update = (data: Partial<typeof belt>) => updateBelt(belt.id, data);

  const radToDeg = (rad: number) => (rad * 180) / Math.PI;
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <>
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-300">Belt Settings</h2>
        <button
          onClick={handleClose}
          className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        {/* Назва */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-white/50 uppercase tracking-wider">Belt Name</label>
          <input
            type="text"
            value={belt.name}
            onChange={(e) => update({ name: e.target.value })}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        {/* Колір каменів */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-white/50 uppercase tracking-wider">Asteroid Color</label>
          <input
            type="color"
            value={belt.color}
            onChange={(e) => update({ color: e.target.value })}
            className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
          />
        </div>

        {/* Повзунки параметрів */}
        <Slider
          label="Orbit (Distance)"
          value={belt.distance}
          min="10"
          max="200"
          step="1"
          displayValue={`${belt.distance} AU`}
          onChange={(val) => update({ distance: val })}
        />
        <Slider
          label="Width"
          value={belt.width}
          min="1"
          max="40"
          step="0.5"
          displayValue={belt.width.toString()}
          onChange={(val) => update({ width: val })}
        />
        <Slider
          label="Asteroid Count"
          value={belt.count}
          min="100"
          max="5000"
          step="100"
          displayValue={belt.count.toString()}
          onChange={(val) => update({ count: val })}
        />
        <Slider
          label="Orbital Speed"
          value={belt.speed}
          min="-1"
          max="1"
          step="0.01"
          displayValue={`${belt.speed}x`}
          onChange={(val) => update({ speed: val })}
        />
        <Slider
          label="Orbital Inclination"
          value={radToDeg(belt.orbitalInclination)}
          min="-180"
          max="180"
          step="1"
          displayValue={`${radToDeg(belt.orbitalInclination).toFixed(0)}°`}
          onChange={(val) => update({ orbitalInclination: degToRad(val) })}
        />

        <button
          onClick={() => {
            removeBelt(belt.id);
            handleClose();
          }}
          className="mt-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm">
          Remove Belt
        </button>
      </div>
    </>
  );
}
