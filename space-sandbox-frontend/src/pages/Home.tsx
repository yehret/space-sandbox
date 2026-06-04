import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import System from '../components/3d/System';
import AuthModal from '../components/ui/AuthModal';
import { SystemCard } from '../components/ui/SystemCard';
import { useAuthStore } from '../store/useAuthStore';
import { useSystemStore } from '../store/useSystemStore';

export default function Home() {
  const navigate = useNavigate();

  const { systems, createSystem, deleteSystem, cloneSystem, fetchSystems } = useSystemStore();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'default' | 'community' | 'my'>('default');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems, user]);

  const filteredSystems = systems.filter((sys) => {
    if (activeTab === 'default') return sys.isDefault;
    if (activeTab === 'community') return sys.isPublic && !sys.isDefault;
    if (activeTab === 'my') return sys.authorId === user?.id;
    return false;
  });

  const handleSystemClick = (id: string) => {
    navigate(`/sandbox/${id}`);
  };

  const handleCreate = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const newName = `New System ${systems.length + 1}`;
    await createSystem(newName);
    setActiveTab('my');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this system?')) {
      deleteSystem(id);
    }
  };

  const handleClone = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    cloneSystem(id);
    setActiveTab('my');
  };

  return (
    <div className="min-h-screen bg-[#030308] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <Canvas
          shadows
          camera={{ position: [80, 180, 40], rotation: [-Math.PI / 2, 0, 0], fov: 45, far: 10000 }}>
          <System />
        </Canvas>
      </div>

      <div className="absolute top-6 right-6 z-20">
        {user ? (
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold uppercase">
              {user.username.charAt(0)}
            </div>
            <span className="font-medium text-gray-200">{user.username}</span>
            <button
              onClick={logout}
              className="ml-2 text-sm text-red-400 hover:text-red-300 transition-colors">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/50 px-6 py-2.5 rounded-xl font-bold tracking-widest uppercase transition-all">
            Login / Register
          </button>
        )}
      </div>

      <h1 className="text-5xl font-black mb-12 tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400 z-10 relative">
        Space Sandbox
      </h1>

      <div className="bg-[#0a0a10]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl z-10 relative w-full max-w-4xl shadow-2xl flex flex-col">
        <div className="flex justify-center gap-4 mb-8">
          {['default', 'community', 'my'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-colors border ${
                activeTab === tab
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10'
              }`}>
              {tab.replace('my', 'My Systems')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1 min-h-[200px]">
          {activeTab === 'my' && !user ? (
            <div className="col-span-full flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-white/10 rounded-2xl border-dashed">
              <svg
                className="w-16 h-16 text-white/20 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-200 mb-2">Authentication Required</h3>
              <p className="text-white/50 mb-6 max-w-md">
                You need to log in to view, create, or clone systems to your personal collection.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold tracking-widest uppercase transition-colors">
                Log In to Continue
              </button>
            </div>
          ) : filteredSystems.length > 0 ? (
            filteredSystems.map((sys) => (
              <SystemCard
                key={sys.id}
                system={sys}
                currentUserId={user?.id}
                onClick={() => handleSystemClick(sys.id)}
                onClone={(e) => handleClone(e, sys.id)}
                onDelete={(e) => handleDelete(e, sys.id)}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center text-white/30 italic">
              No systems found in this category.
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center border-t border-white/10 pt-8">
          <button
            onClick={handleCreate}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold tracking-widest uppercase transition-colors">
            Create New System
          </button>
        </div>
      </div>

      <Loader containerStyles={{ background: '#030308', zIndex: 40 }} />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
