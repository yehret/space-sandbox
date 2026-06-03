import { useEffect, useRef, useState } from 'react';
import { MoonData } from '../../types';
import { Slider } from './Slider';
import { TEXTURE_PRESETS, degToRad, radToDeg } from './editorConstants';

interface MoonEditorProps {
  moon: MoonData;
  isOwner: boolean;
  onUpdate: (data: Partial<MoonData>) => void;
  onDelete: () => void;
  onBack: () => void;
  onClose: () => void;
}

export const MoonEditor = ({
  moon,
  isOwner,
  onUpdate,
  onDelete,
  onBack,
  onClose,
}: MoonEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTexture =
    TEXTURE_PRESETS.find((t) => t.url === (moon.textureUrl || '')) || TEXTURE_PRESETS[0];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-lg font-bold">Moon</h2>
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
            <label className="text-xs text-white/50 uppercase tracking-wider">Moon Name</label>
            <input
              type="text"
              value={moon.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">Surface Color</label>
            <input
              type="color"
              value={moon.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
          </div>

          <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
            <label className="text-xs text-white/50 uppercase tracking-wider">Moon Texture</label>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-black/50 border border-white/10 hover:bg-white/5 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentTexture.url ? (
                  <img
                    src={currentTexture.url}
                    alt="preview"
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20" />
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
                      onUpdate({ textureUrl: tex.url || undefined });
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 hover:bg-white/10 cursor-pointer transition-colors ${
                      (moon.textureUrl || '') === tex.url ? 'bg-blue-500/20' : ''
                    }`}>
                    {tex.url ? (
                      <img
                        src={tex.url}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
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
            value={moon.distance}
            min="1"
            max="20"
            step="0.1"
            displayValue={`${moon.distance.toFixed(1)}`}
            onChange={(val) => onUpdate({ distance: val })}
          />
          <Slider
            label="Size"
            value={moon.size}
            min="0.05"
            max="2"
            step="0.05"
            displayValue={moon.size.toFixed(2)}
            onChange={(val) => onUpdate({ size: val })}
          />
          <Slider
            label="Speed"
            value={moon.speed}
            min="-5"
            max="5"
            step="0.1"
            displayValue={`${moon.speed}x`}
            onChange={(val) => onUpdate({ speed: val })}
          />
          <Slider
            label="Orbital Inclination"
            value={radToDeg(moon.orbitalInclination)}
            min="-180"
            max="180"
            step="1"
            displayValue={`${radToDeg(moon.orbitalInclination).toFixed(0)}°`}
            onChange={(val) => onUpdate({ orbitalInclination: degToRad(val) })}
          />
        </div>

        {isOwner && (
          <button
            onClick={onDelete}
            className="mt-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm">
            Destroy Moon
          </button>
        )}
      </div>
    </div>
  );
};
