import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import { useAuthStore } from '../../store/useAuthStore';
import { useSystemStore } from '../../store/useSystemStore';

export const SystemHeader = () => {
  const navigate = useNavigate();

  const { systems, activeSystemId, saveActiveSystem, toggleSystemVisibility, updateSystemName } =
    useSystemStore(
      useShallow((state) => ({
        systems: state.systems,
        activeSystemId: state.activeSystemId,
        saveActiveSystem: state.saveActiveSystem,
        toggleSystemVisibility: state.toggleSystemVisibility,
        updateSystemName: state.updateSystemName,
      })),
    );
  const { user } = useAuthStore();

  const activeSystem = activeSystemId ? systems[activeSystemId] : null;
  const isOwner = user !== null && activeSystem?.authorId === user.id;

  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  useEffect(() => {
    if (activeSystem) {
      setEditNameValue(activeSystem.name);
    }
  }, [activeSystem?.name]);

  const handleBackToMenu = () => {
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveActiveSystem();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save system.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!activeSystem) return;
    setIsToggling(true);
    try {
      await toggleSystemVisibility(activeSystem.id, !activeSystem.isPublic);
    } catch (error) {
      console.error('Failed to toggle visibility', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleNameSubmit = () => {
    if (editNameValue.trim() !== '') {
      updateSystemName(editNameValue.trim());
    } else {
      setEditNameValue(activeSystem?.name || 'Unknown System');
    }
    setIsEditingName(false);
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
        {isEditingName ? (
          <input
            type="text"
            autoFocus
            value={editNameValue}
            onChange={(e) => setEditNameValue(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameSubmit();
              if (e.key === 'Escape') {
                setIsEditingName(false);
                setEditNameValue(activeSystem?.name || '');
              }
            }}
            className="text-4xl font-black tracking-widest uppercase bg-transparent border-b-2 border-blue-500 outline-none text-white w-80 text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
        ) : (
          <h1
            onClick={() => {
              if (isOwner) setIsEditingName(true);
            }}
            className={`text-4xl font-black tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] ${
              isOwner ? 'cursor-pointer hover:text-blue-300 transition-colors' : ''
            }`}
            title={isOwner ? 'Click to edit name' : ''}>
            {activeSystem?.name || 'Unknown System'}
          </h1>
        )}

        {!isOwner ? (
          <span className="bg-white/10 border border-white/20 text-white/70 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            View Only
          </span>
        ) : (
          <>
            <button
              onClick={handleToggleVisibility}
              disabled={isToggling}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all shadow-lg ${
                activeSystem?.isPublic
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                  : 'bg-gray-700 hover:bg-gray-600 text-white/80 shadow-gray-900/20'
              }`}>
              {isToggling ? 'Updating...' : activeSystem?.isPublic ? '★ Public' : 'Make Public'}
            </button>

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
          </>
        )}
      </div>
    </div>
  );
};
