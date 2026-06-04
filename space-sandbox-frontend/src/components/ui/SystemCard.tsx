import { SpaceSystem } from '../../types';

interface SystemCardProps {
  system: SpaceSystem;
  onClick: () => void;
  onClone?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  currentUserId?: string;
}

const MiniMap = ({ system }: { system: SpaceSystem }) => {
  const star = system.star || { color: '#ffffff', size: 1 };
  const planets = system.planets || [];

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
      <circle cx="50" cy="50" r="15" fill={star.color} opacity="0.1" filter="blur(4px)" />
      <circle cx="50" cy="50" r="5" fill={star.color} />

      {planets.slice(0, 5).map((p, i) => {
        const orbitRadius = 15 + i * 7;

        const angle = i * 137.5 * (Math.PI / 180);
        const px = 50 + orbitRadius * Math.cos(angle);
        const py = 50 + orbitRadius * Math.sin(angle);

        return (
          <g key={p.id}>
            <circle
              cx="50"
              cy="50"
              r={orbitRadius}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
              strokeDasharray="1 2"
            />
            <circle cx={px} cy={py} r="1.5" fill={p.color || '#aaaaaa'} />
          </g>
        );
      })}

      {planets.length > 5 && (
        <text x="85" y="90" fill="rgba(255,255,255,0.3)" fontSize="6" fontWeight="bold">
          +{planets.length - 5}
        </text>
      )}
    </svg>
  );
};

export const SystemCard = ({
  system,
  onClick,
  onClone,
  onDelete,
  currentUserId,
}: SystemCardProps) => {
  const isOwner = system.authorId === currentUserId;

  return (
    <div
      onClick={onClick}
      className="relative bg-[#0d0d14] border border-white/10 hover:border-blue-500/50 rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden flex flex-col h-64 shadow-lg hover:shadow-blue-500/10">
      <div className="h-36 w-full bg-black/40 relative flex items-center justify-center overflow-hidden">
        <MiniMap system={system} />

        {/* <div className="absolute top-3 left-3 flex gap-2">
          {system.isPublic && (
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Public
            </span>
          )}
          {system.isDefault && (
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Default
            </span>
          )}
        </div> */}

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          {!isOwner && onClone && (
            <button
              onClick={onClone}
              className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-md transition-colors backdrop-blur-sm"
              title="Clone to My Systems">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
          {isOwner && onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors backdrop-blur-sm"
              title="Delete System">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 border-t border-white/5 bg-gradient-to-b from-transparent to-black/20">
        <h3 className="text-lg font-bold text-gray-200 mb-1 truncate group-hover:text-blue-400 transition-colors">
          {system.name}
        </h3>

        <p className="text-xs text-white/40 mb-3 font-medium">
          {system.author?.username ? `By ${system.author.username}` : 'By Unknown Explorer'}
        </p>

        <div className="mt-auto flex justify-between items-center text-xs text-white/30 font-bold tracking-wider">
          <div className="flex gap-3">
            <span className="flex items-center gap-1" title="Planets">
              <span className="text-sm">🪐</span> {system.planets?.length || 0}
            </span>
            {/* <span className="flex items-center gap-1" title="Asteroid Belts">
              <span className="text-sm">☄️</span> {system.belts?.length || 0}
            </span> */}
          </div>
          <span>
            {new Date(system.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
