import { useSystemStore } from '../../store/useSystemStore';
import { Slider } from './Slider';

const STAR_CLASSES = [
  { id: 'O', name: 'Blue Giant', color: '#8A9AFA', desc: '30,000K+' },
  { id: 'B', name: 'Blue', color: '#A5B9FA', desc: '10,000K - 30,000K' },
  { id: 'A', name: 'White', color: '#FFFFFF', desc: '7,500K - 10,000K' },
  { id: 'F', name: 'Yellow-White', color: '#FFF4E8', desc: '6,000K - 7,500K' },
  { id: 'G', name: 'Yellow Dwarf', color: '#FDB813', desc: '5,200K - 6,000K (Sun)' },
  { id: 'K', name: 'Orange', color: '#FF8C00', desc: '3,700K - 5,200K' },
  { id: 'M', name: 'Red Dwarf', color: '#FF2400', desc: '2,400K - 3,700K' },
];

export default function StarEditor({ onClose }: { onClose: () => void }) {
  const { systems, activeSystemId, updateStar, setIsPaused } = useSystemStore();
  const star = systems.find((s) => s.id === activeSystemId)?.star;

  if (!star) return null;

  const handleClose = () => {
    onClose();
    setIsPaused(false);
  };

  const activeClass = STAR_CLASSES.find((c) => c.color === star.color) || STAR_CLASSES[4];

  return (
    <>
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h2 className="text-lg font-bold text-orange-400">Star Settings</h2>
        <button
          onClick={handleClose}
          className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-white/50 uppercase tracking-wider">Star Name</label>
          <input
            type="text"
            value={star.name}
            onChange={(e) => updateStar({ name: e.target.value })}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs text-white/50 uppercase tracking-wider">Spectral Class</label>

          <div className="flex justify-between bg-black/50 p-2 rounded-xl border border-white/10">
            {STAR_CLASSES.map((starClass) => (
              <button
                key={starClass.id}
                onClick={() => updateStar({ color: starClass.color })}
                className={`w-8 h-8 rounded-full transition-all duration-300 border-2 ${
                  star.color === starClass.color
                    ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                    : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: starClass.color }}
                title={starClass.name}
              />
            ))}
          </div>

          <div className="flex flex-col bg-white/5 px-3 py-2 rounded-lg border border-white/5 text-sm">
            <span className="font-bold text-white">
              {activeClass.name} (Class {activeClass.id})
            </span>
            <span className="text-white/50 text-xs">Temperature: {activeClass.desc}</span>
          </div>
        </div>

        <Slider
          label="Star Radius"
          value={star.size}
          min="0.5"
          max="15"
          step="0.1"
          displayValue={star.size.toFixed(1)}
          onChange={(val) => updateStar({ size: val })}
        />

        <Slider
          label="Mass (relative to Sun)"
          value={star.mass}
          min="0.1"
          max="50"
          step="0.1"
          displayValue={`${star.mass.toFixed(1)} M☉`}
          onChange={(val) => updateStar({ mass: val })}
        />
      </div>
    </>
  );
}
