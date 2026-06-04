import { useState } from 'react';
import { useUIStore } from '../store/useUiStore';
import BeltEditor from './ui/BeltEditor';
import { PlanetEditor } from './ui/PlanetEditor';
import StarEditor from './ui/StarEditor';
import { SystemEditor } from './ui/SystemEditor';
import { SystemHeader } from './ui/SystemHeader';
import { TimeControls } from './ui/TimeControls';
import ViewControls from './ui/ViewControls';

export default function UI() {
  const [uiView, setUiView] = useState<'list' | 'edit-planet' | 'edit-star' | 'edit-belt'>('list');

  const [editingPlanetId, setEditingPlanetId] = useState<string | null>(null);
  const [editingBeltId, setEditingBeltId] = useState<string | null>(null);

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const isZenMode = useUIStore((state) => state.isZenMode);
  const toggleZenMode = useUIStore((state) => state.toggleZenMode);

  if (isZenMode) {
    return (
      <button
        onClick={toggleZenMode}
        className="absolute bottom-8 left-8 pointer-events-auto bg-black/50 p-2 rounded-lg border border-white/10 transition-all duration-500 opacity-10 hover:opacity-100 cursor-pointer">
        🧘
      </button>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-sans text-white overflow-hidden">
      <SystemHeader />

      <div
        className={`absolute right-6 top-1/2 -translate-y-1/2 w-80 lg:w-96 flex flex-col pointer-events-auto bg-[#030308]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 h-[85vh] max-h-[800px] ${
          isSidebarOpen ? 'left-4 lg:left-8 translate-x-0' : 'left-0 -translate-x-full'
        }`}>
        <div className="flex flex-col h-full overflow-hidden rounded-2xl">
          {uiView === 'list' && (
            <SystemEditor
              onEditPlanet={(id) => {
                setEditingPlanetId(id);
                setUiView('edit-planet');
              }}
              onEditStar={() => setUiView('edit-star')}
              onEditBelt={(id) => {
                setEditingBeltId(id);
                setUiView('edit-belt');
              }}
            />
          )}

          {uiView === 'edit-planet' && (
            <PlanetEditor
              planetId={editingPlanetId!}
              onClose={() => {
                setUiView('list');
                setEditingPlanetId(null);
              }}
            />
          )}

          {uiView === 'edit-star' && <StarEditor onClose={() => setUiView('list')} />}

          {uiView === 'edit-belt' && (
            <BeltEditor
              beltId={editingBeltId!}
              onClose={() => {
                setUiView('list');
                setEditingBeltId(null);
              }}
            />
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="absolute top-1/2 -translate-y-1/2 -right-8 w-8 h-20 bg-[#030308]/80 backdrop-blur-xl border border-white/10 border-l-0 rounded-r-xl flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer pointer-events-auto"
          title={isSidebarOpen ? 'Сховати панель' : 'Показати панель'}>
          <svg
            className={`w-5 h-5 transition-transform duration-500 ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="pointer-events-auto">
        <ViewControls />
      </div>

      <TimeControls />

      <button
        onClick={toggleZenMode}
        className="absolute bottom-8 left-8 pointer-events-auto bg-black/50 p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
        🧘
      </button>
    </div>
  );
}
