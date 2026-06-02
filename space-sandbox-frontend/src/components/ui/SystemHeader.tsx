import { useSystemStore } from '../../store/useSystemStore';

export const SystemHeader = () => {
  const activeSystemId = useSystemStore((state) => state.activeSystemId);
  const activeSystem = useSystemStore((state) =>
    state.systems.find((s) => s.id === activeSystemId),
  );

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto text-center">
      <h1 className="text-4xl font-black tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
        {activeSystem?.name || 'Невідома система'}
      </h1>
    </div>
  );
};
