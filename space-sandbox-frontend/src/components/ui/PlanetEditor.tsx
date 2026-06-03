import { useEffect, useRef, useState } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { MoonData, PlanetaryRingData } from '../../types';
import { TEXTURE_PRESETS, degToRad, radToDeg } from './editorConstants';
import { MoonEditor } from './MoonEditor';
import { RingEditor } from './RingEditor';
import { Slider } from './Slider';

export const PlanetEditor = ({ planetId, onClose }: { planetId: string; onClose: () => void }) => {
  const { currentUser, systems, activeSystemId, updatePlanet, removePlanet } = useSystemStore();

  const activeSystem = systems.find((s) => s.id === activeSystemId);
  const planet = activeSystem?.planets.find((p) => p.id === planetId);
  const isOwner = currentUser !== null && activeSystem?.authorId === currentUser.id;

  const [editingMoonId, setEditingMoonId] = useState<string | null>(null);
  const [editingRingId, setEditingRingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!planet) return null;

  const update = (data: Partial<typeof planet>) => updatePlanet(planet.id, data);

  // --- Helpers for Moons ---
  const handleAddMoon = () => {
    const newMoon: MoonData = {
      id: crypto.randomUUID(),
      name: 'New Moon',
      size: 0.2,
      distance: 2.5,
      speed: 1.5,
      orbitalInclination: 0,
      color: '#dddddd',
    };
    update({ moons: [...(planet.moons || []), newMoon] });
    setEditingMoonId(newMoon.id);
  };
  const updateMoon = (moonId: string, data: Partial<MoonData>) => {
    update({ moons: (planet.moons || []).map((m) => (m.id === moonId ? { ...m, ...data } : m)) });
  };
  const removeMoon = (moonId: string) => {
    update({ moons: (planet.moons || []).filter((m) => m.id !== moonId) });
    setEditingMoonId(null);
  };

  // --- Helpers for Rings ---
  const handleAddRing = () => {
    const newRing: PlanetaryRingData = {
      id: crypto.randomUUID(),
      name: 'New Ring',
      innerRadius: 1.5,
      outerRadius: 2.0,
      color: '#ffffff',
      opacity: 0.5,
    };
    update({ rings: [...(planet.rings || []), newRing] });
    setEditingRingId(newRing.id);
  };
  const updateRing = (ringId: string, data: Partial<PlanetaryRingData>) => {
    update({ rings: (planet.rings || []).map((r) => (r.id === ringId ? { ...r, ...data } : r)) });
  };
  const removeRing = (ringId: string) => {
    update({ rings: (planet.rings || []).filter((r) => r.id !== ringId) });
    setEditingRingId(null);
  };

  // --- RENDER ORCHESTRATION ---
  const editingMoon = planet.moons?.find((m) => m.id === editingMoonId);
  if (editingMoonId && editingMoon) {
    return (
      <MoonEditor
        moon={editingMoon}
        isOwner={isOwner}
        onUpdate={(data) => updateMoon(editingMoon.id, data)}
        onDelete={() => removeMoon(editingMoon.id)}
        onBack={() => setEditingMoonId(null)}
        onClose={onClose}
      />
    );
  }

  const editingRing = planet.rings?.find((r) => r.id === editingRingId);
  if (editingRingId && editingRing) {
    return (
      <RingEditor
        ring={editingRing}
        isOwner={isOwner}
        onUpdate={(data) => updateRing(editingRing.id, data)}
        onDelete={() => removeRing(editingRing.id)}
        onBack={() => setEditingRingId(null)}
        onClose={onClose}
      />
    );
  }

  // --- MAIN PLANET RENDER ---
  const currentTexture =
    TEXTURE_PRESETS.find((t) => t.url === (planet.textureUrl || '')) || TEXTURE_PRESETS[0];

  return (
    <>
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-lg font-bold">Planet Settings</h2>
        </div>
        <button
          onClick={onClose}
          className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        <div className={`flex flex-col gap-6 ${!isOwner ? 'pointer-events-none opacity-60' : ''}`}>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">Planet Name</label>
            <input
              type="text"
              value={planet.name}
              onChange={(e) => update({ name: e.target.value })}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">
              Atmosphere Color
            </label>
            <input
              type="color"
              value={planet.color}
              onChange={(e) => update({ color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
          </div>

          <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
            <label className="text-xs text-white/50 uppercase tracking-wider">Planet Texture</label>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-black/50 border border-white/10 hover:bg-white/5 rounded-lg px-3 py-2 text-white outline-none flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentTexture.url ? (
                  <img
                    src={currentTexture.url}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/10" />
                )}
                <span className="text-sm truncate">{currentTexture.name}</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-[#0a0a0f] border border-white/10 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto custom-scrollbar">
                {TEXTURE_PRESETS.map((tex) => (
                  <div
                    key={tex.name}
                    onClick={() => {
                      update({ textureUrl: tex.url || undefined });
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 hover:bg-white/10 cursor-pointer ${planet.textureUrl === tex.url ? 'bg-blue-500/20' : ''}`}>
                    {tex.url ? (
                      <img
                        src={tex.url}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-[10px] text-white/50">N/A</span>
                      </div>
                    )}
                    <span className="text-sm text-white font-medium">{tex.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Slider
            label="Orbit (Distance)"
            value={planet.distance}
            min="5"
            max="150"
            step="1"
            displayValue={`${planet.distance} AU`}
            onChange={(val) => update({ distance: val })}
          />
          <Slider
            label="Orbital Speed"
            value={planet.speed}
            min="-2"
            max="2"
            step="0.01"
            displayValue={`${planet.speed}x`}
            onChange={(val) => update({ speed: val })}
          />
          <Slider
            label="Size"
            value={planet.size}
            min="0.1"
            max="10"
            step="0.1"
            displayValue={planet.size.toFixed(1)}
            onChange={(val) => update({ size: val })}
          />
          <Slider
            label="Rotation Speed"
            value={planet.rotationSpeed}
            min="-0.5"
            max="0.5"
            step="0.005"
            displayValue={planet.rotationSpeed.toFixed(3)}
            onChange={(val) => update({ rotationSpeed: val })}
          />
          <Slider
            label="Orbital Inclination"
            value={radToDeg(planet.orbitalInclination)}
            min="-180"
            max="180"
            step="1"
            displayValue={`${radToDeg(planet.orbitalInclination).toFixed(0)}°`}
            onChange={(val) => update({ orbitalInclination: degToRad(val) })}
          />
          <Slider
            label="Axial Tilt"
            value={radToDeg(planet.axialTilt)}
            min="-180"
            max="180"
            step="1"
            displayValue={`${radToDeg(planet.axialTilt).toFixed(0)}°`}
            onChange={(val) => update({ axialTilt: degToRad(val) })}
          />
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">
              Ring System
            </h3>
            <span className="text-xs text-white/40">{planet.rings?.length || 0} rings</span>
          </div>
          <div className="flex flex-col gap-2">
            {planet.rings?.map((ring) => (
              <div
                key={ring.id}
                onClick={() => setEditingRingId(ring.id)}
                className="p-2 bg-black/30 hover:bg-white/10 transition-colors rounded-lg border border-white/5 cursor-pointer flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full opacity-70"
                    style={{ backgroundColor: ring.color }}
                  />
                  <span className="font-medium text-sm text-gray-200">{ring.name}</span>
                </div>
                <span className="text-xs text-white/30">
                  {ring.innerRadius.toFixed(1)} - {ring.outerRadius.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
          {isOwner && (
            <button
              onClick={handleAddRing}
              className="w-full py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg font-medium text-sm border border-white/10 text-orange-200/70">
              + Add Ring
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">Moons</h3>
            <span className="text-xs text-white/40">{planet.moons?.length || 0} moons</span>
          </div>
          <div className="flex flex-col gap-2">
            {planet.moons?.map((moon) => (
              <div
                key={moon.id}
                onClick={() => setEditingMoonId(moon.id)}
                className="p-2 bg-black/30 hover:bg-white/10 transition-colors rounded-lg border border-white/5 cursor-pointer flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moon.color }} />
                <span className="font-medium text-sm text-gray-200">{moon.name}</span>
              </div>
            ))}
          </div>
          {isOwner && (
            <button
              onClick={handleAddMoon}
              className="w-full py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg font-medium text-sm border border-white/10">
              + Add Moon
            </button>
          )}
        </div>

        {isOwner && (
          <button
            onClick={() => {
              removePlanet(planet.id);
              onClose();
            }}
            className="mt-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm">
            Delete Planet
          </button>
        )}
      </div>
    </>
  );
};
