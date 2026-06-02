import { useState } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { MoonData, PlanetaryRingData } from '../../types';
import { Slider } from './Slider';

export const PlanetEditor = ({ planetId, onClose }: { planetId: string; onClose: () => void }) => {
  const { systems, activeSystemId, updatePlanet, removePlanet, setIsPaused } = useSystemStore();
  const planet = systems
    .find((s) => s.id === activeSystemId)
    ?.planets.find((p) => p.id === planetId);

  // Стейт для навігації вглиб
  const [editingMoonId, setEditingMoonId] = useState<string | null>(null);
  const [editingRingId, setEditingRingId] = useState<string | null>(null);

  if (!planet) return null;

  const handleClose = () => {
    onClose();
    setIsPaused(false);
  };

  const update = (data: Partial<typeof planet>) => updatePlanet(planet.id, data);

  // --- ЛОГІКА СУПУТНИКІВ ---
  const handleAddMoon = () => {
    const newMoon: MoonData = {
      id: crypto.randomUUID(),
      name: 'Новий супутник',
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
    const updatedMoons = (planet.moons || []).map((m) => (m.id === moonId ? { ...m, ...data } : m));
    update({ moons: updatedMoons });
  };

  const removeMoon = (moonId: string) => {
    const updatedMoons = (planet.moons || []).filter((m) => m.id !== moonId);
    update({ moons: updatedMoons });
    setEditingMoonId(null);
  };

  const editingMoon = planet.moons?.find((m) => m.id === editingMoonId);

  // --- ЛОГІКА КІЛЕЦЬ ---
  const handleAddRing = () => {
    const newRing: PlanetaryRingData = {
      id: crypto.randomUUID(),
      name: 'Нове кільце',
      innerRadius: 1.5,
      outerRadius: 2.0,
      color: '#ffffff',
      opacity: 0.5,
    };
    update({ rings: [...(planet.rings || []), newRing] });
    setEditingRingId(newRing.id);
  };

  const updateRing = (ringId: string, data: Partial<PlanetaryRingData>) => {
    const updatedRings = (planet.rings || []).map((r) => (r.id === ringId ? { ...r, ...data } : r));
    update({ rings: updatedRings });
  };

  const removeRing = (ringId: string) => {
    const updatedRings = (planet.rings || []).filter((r) => r.id !== ringId);
    update({ rings: updatedRings });
    setEditingRingId(null);
  };

  const editingRing = planet.rings?.find((r) => r.id === editingRingId);

  // Конвертери для кутів
  const radToDeg = (rad: number) => (rad * 180) / Math.PI;
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  // ==========================================
  // РЕНДЕР: МЕНЮ СУПУТНИКА
  // ==========================================
  if (editingMoonId && editingMoon) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingMoonId(null)}
              className="text-white/50 hover:text-white transition-colors"
              title="Назад до планети">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-lg font-bold">Супутник</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
            Готово
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">
              Назва супутника
            </label>
            <input
              type="text"
              value={editingMoon.name}
              onChange={(e) => updateMoon(editingMoon.id, { name: e.target.value })}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">Колір поверхні</label>
            <input
              type="color"
              value={editingMoon.color}
              onChange={(e) => updateMoon(editingMoon.id, { color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
          </div>

          <Slider
            label="Орбіта (Відстань)"
            value={editingMoon.distance}
            min="1"
            max="20"
            step="0.1"
            displayValue={`${editingMoon.distance.toFixed(1)}`}
            onChange={(val) => updateMoon(editingMoon.id, { distance: val })}
          />
          <Slider
            label="Розмір"
            value={editingMoon.size}
            min="0.05"
            max="2"
            step="0.05"
            displayValue={editingMoon.size.toFixed(2)}
            onChange={(val) => updateMoon(editingMoon.id, { size: val })}
          />
          <Slider
            label="Швидкість"
            value={editingMoon.speed}
            min="-5"
            max="5"
            step="0.1"
            displayValue={`${editingMoon.speed}x`}
            onChange={(val) => updateMoon(editingMoon.id, { speed: val })}
          />
          <Slider
            label="Нахил орбіти"
            value={radToDeg(editingMoon.orbitalInclination)}
            min="-180"
            max="180"
            step="1"
            displayValue={`${radToDeg(editingMoon.orbitalInclination).toFixed(0)}°`}
            onChange={(val) => updateMoon(editingMoon.id, { orbitalInclination: degToRad(val) })}
          />

          <button
            onClick={() => removeMoon(editingMoon.id)}
            className="mt-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm">
            Знищити супутник
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // РЕНДЕР: МЕНЮ КІЛЬЦЯ
  // ==========================================
  if (editingRingId && editingRing) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingRingId(null)}
              className="text-white/50 hover:text-white transition-colors"
              title="Назад до планети">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-lg font-bold">Кільце</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
            Готово
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">Назва кільця</label>
            <input
              type="text"
              value={editingRing.name}
              onChange={(e) => updateRing(editingRing.id, { name: e.target.value })}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">Колір пилу</label>
            <input
              type="color"
              value={editingRing.color}
              onChange={(e) => updateRing(editingRing.id, { color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
          </div>

          <Slider
            label="Внутрішній радіус"
            value={editingRing.innerRadius}
            min="1.1"
            max={editingRing.outerRadius - 0.05}
            step="0.05"
            displayValue={`${editingRing.innerRadius.toFixed(2)}x`}
            onChange={(val) => updateRing(editingRing.id, { innerRadius: val })}
          />
          <Slider
            label="Зовнішній радіус"
            value={editingRing.outerRadius}
            min={editingRing.innerRadius + 0.05}
            max="5"
            step="0.05"
            displayValue={`${editingRing.outerRadius.toFixed(2)}x`}
            onChange={(val) => updateRing(editingRing.id, { outerRadius: val })}
          />
          <Slider
            label="Густота (Прозорість)"
            value={editingRing.opacity}
            min="0.1"
            max="1"
            step="0.05"
            displayValue={`${Math.round(editingRing.opacity * 100)}%`}
            onChange={(val) => updateRing(editingRing.id, { opacity: val })}
          />

          <button
            onClick={() => removeRing(editingRing.id)}
            className="mt-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm">
            Видалити кільце
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // РЕНДЕР: МЕНЮ ПЛАНЕТИ
  // ==========================================
  return (
    <>
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h2 className="text-lg font-bold">Налаштування планети</h2>
        <button
          onClick={handleClose}
          className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
          Готово
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        {/* Базові параметри */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-white/50 uppercase tracking-wider">Назва планети</label>
          <input
            type="text"
            value={planet.name}
            onChange={(e) => update({ name: e.target.value })}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-white/50 uppercase tracking-wider">Колір атмосфери</label>
          <input
            type="color"
            value={planet.color}
            onChange={(e) => update({ color: e.target.value })}
            className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
          />
        </div>

        {/* Повзунки Планети */}
        <Slider
          label="Орбіта (Відстань)"
          value={planet.distance}
          min="5"
          max="150"
          step="1"
          displayValue={`${planet.distance} AU`}
          onChange={(val) => update({ distance: val })}
        />

        <Slider
          label="Швидкість орбіти"
          value={planet.speed}
          min="-2"
          max="2"
          step="0.01"
          displayValue={`${planet.speed}x`}
          onChange={(val) => update({ speed: val })}
        />
        <Slider
          label="Розмір"
          value={planet.size}
          min="0.1"
          max="10"
          step="0.1"
          displayValue={planet.size.toFixed(1)}
          onChange={(val) => update({ size: val })}
        />
        <Slider
          label="Швидкість обертання (Вісь)"
          value={planet.rotationSpeed}
          min="-0.5"
          max="0.5"
          step="0.005"
          displayValue={planet.rotationSpeed.toFixed(3)}
          onChange={(val) => update({ rotationSpeed: val })}
        />
        <Slider
          label="Нахил орбіти"
          value={radToDeg(planet.orbitalInclination)}
          min="-180"
          max="180"
          step="1"
          displayValue={`${radToDeg(planet.orbitalInclination).toFixed(0)}°`}
          onChange={(val) => update({ orbitalInclination: degToRad(val) })}
        />
        <Slider
          label="Нахил осі"
          value={radToDeg(planet.axialTilt)}
          min="-180"
          max="180"
          step="1"
          displayValue={`${radToDeg(planet.axialTilt).toFixed(0)}°`}
          onChange={(val) => update({ axialTilt: degToRad(val) })}
        />

        {/* --- БЛОК КІЛЕЦЬ --- */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">
              Система кілець
            </h3>
            <span className="text-xs text-white/40">{planet.rings?.length || 0} шт.</span>
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

          <button
            onClick={handleAddRing}
            className="w-full py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg font-medium text-sm border border-white/10 text-orange-200/70">
            + Додати кільце
          </button>
        </div>

        {/* --- БЛОК СУПУТНИКІВ --- */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">Супутники</h3>
            <span className="text-xs text-white/40">{planet.moons?.length || 0} шт.</span>
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

          <button
            onClick={handleAddMoon}
            className="w-full py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg font-medium text-sm border border-white/10">
            + Додати супутник
          </button>
        </div>

        <button
          onClick={() => {
            removePlanet(planet.id);
            handleClose();
          }}
          className="mt-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm">
          Знищити планету
        </button>
      </div>
    </>
  );
};
