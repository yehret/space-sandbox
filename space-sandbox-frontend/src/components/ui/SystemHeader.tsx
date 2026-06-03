// src/components/ui/SystemHeader.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemStore } from '../../store/useSystemStore';

export const SystemHeader = () => {
  const navigate = useNavigate();
  const { currentUser, systems, activeSystemId } = useSystemStore();

  const activeSystem = systems.find((s) => s.id === activeSystemId);

  // 🔥 ПЕРЕВІРКА ВЛАСНИКА:
  const isOwner = currentUser !== null && activeSystem?.authorId === currentUser.id;

  const [isSaving, setIsSaving] = useState(false);

  const handleBackToMenu = () => {
    navigate('/');
  };

  const handleSave = () => {
    setIsSaving(true);
    // Імітація запиту до бекенду (2 секунди)
    setTimeout(() => {
      setIsSaving(false);
      // Тут можна додати якийсь тост/сповіщення про успіх
    }, 1500);
  };

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-5 items-center pointer-events-auto">
      <button
        onClick={handleBackToMenu}
        className="cursor-pointer p-2 bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-lg transition-colors text-white"
        title="Back to Home">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-black tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {activeSystem?.name || 'Unknown System'}
        </h1>

        {!isOwner ? (
          <span className="bg-white/10 border border-white/20 text-white/70 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            View Only
          </span>
        ) : (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all shadow-lg ${
              isSaving
                ? 'bg-green-500/50 text-white cursor-wait'
                : 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20'
            }`}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  );
};
