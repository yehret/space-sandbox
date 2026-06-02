import { useSystemStore } from '../../store/useSystemStore';

export default function ViewControls() {
  const {
    showGrid,
    toggleGrid,
    showTrails,
    toggleTrails,
    showOrbits,
    toggleOrbits,
    triggerCameraReset,
    followTargetId,
    setFollowTarget,
  } = useSystemStore();

  const buttons = [
    { label: 'Grid', active: showGrid, onClick: toggleGrid },
    { label: 'Trails', active: showTrails, onClick: toggleTrails },
    { label: 'Orbits', active: showOrbits, onClick: toggleOrbits },
  ];

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 items-center flex flex-col gap-3 z-10">
      <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 ${
              btn.active
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
            title={btn.label}>
            {btn.label}
            {/* {btn.label.slice(0, 3)} */}
          </button>
        ))}
      </div>

      {followTargetId ? (
        <button
          onClick={() => setFollowTarget(null)}
          className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all shadow-xl"
          title="Unlock Camera">
          <span className="text-xs">Unlock</span>
        </button>
      ) : (
        <button
          onClick={triggerCameraReset}
          className="w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-xl"
          title="Reset View">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
