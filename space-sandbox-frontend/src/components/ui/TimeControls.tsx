import { useSystemStore } from '../../store/useSystemStore';

export const TimeControls = () => {
  const { isPaused, setIsPaused, timeScale, setTimeScale } = useSystemStore();

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-auto bg-[#030308]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
        {isPaused ? (
          <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        )}
      </button>

      <div className="flex flex-col items-center gap-2 w-72">
        <div className="flex justify-between w-full text-xs font-mono text-white/60">
          <span>-25x</span>
          <span className={timeScale === 1 ? 'text-blue-400 font-bold' : 'text-white'}>
            Час: {timeScale.toFixed(1)}x
          </span>
          <span>25x</span>
        </div>
        <input
          type="range"
          min="-25"
          max="25"
          step="0.1"
          value={timeScale}
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          className="w-full accent-blue-500 cursor-ew-resize"
        />
      </div>

      <button
        onClick={() => setTimeScale(1)}
        className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg">
        Скинути
      </button>
    </div>
  );
};
