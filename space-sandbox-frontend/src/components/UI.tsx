import { useState } from 'react';
import BeltEditor from './ui/BeltEditor';
import { PlanetEditor } from './ui/PlanetEditor';
import { PlanetList } from './ui/PlanetList';
import StarEditor from './ui/StarEditor';
import { SystemHeader } from './ui/SystemHeader';
import { TimeControls } from './ui/TimeControls';

export default function UI() {
  const [uiView, setUiView] = useState<'list' | 'edit-planet' | 'edit-star' | 'edit-belt'>('list');

  // Нам потрібен ще один стейт для ID поясу (можна об'єднати з editingPlanetId в один editingObjectId, але залишимо так для простоти)
  const [editingPlanetId, setEditingPlanetId] = useState<string | null>(null);
  const [editingBeltId, setEditingBeltId] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-sans text-white">
      <SystemHeader />

      <div className="absolute top-8 left-8 w-96 max-h-[calc(100vh-4rem)] flex flex-col pointer-events-auto bg-[#030308]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {uiView === 'list' && (
          <PlanetList
            onEditPlanet={(id) => {
              setEditingPlanetId(id);
              setUiView('edit-planet');
            }}
            onEditStar={() => setUiView('edit-star')}
            onEditBelt={(id) => {
              setEditingBeltId(id);
              setUiView('edit-belt');
            }} // <-- Передаємо проп
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

        {/* Додаємо рендер редактора поясу */}
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

      <TimeControls />
    </div>
  );
}
