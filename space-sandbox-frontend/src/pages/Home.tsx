import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import System from '../components/3d/System';
import AuthModal from '../components/ui/AuthModal';
import { SystemCard } from '../components/ui/SystemCard';
import { useAuthStore } from '../store/useAuthStore';
import { useSystemStore } from '../store/useSystemStore';

export default function Home() {
  const navigate = useNavigate();

  const { systems, createSystem, deleteSystem, cloneSystem, fetchSystems } = useSystemStore(
    useShallow((state) => ({
      systems: state.systems,
      createSystem: state.createSystem,
      deleteSystem: state.deleteSystem,
      cloneSystem: state.cloneSystem,
      fetchSystems: state.fetchSystems,
    })),
  );
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'default' | 'community' | 'my'>('default');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems, user]);

  const systemsArray = Object.values(systems);
  const filteredSystems = systemsArray.filter((sys) => {
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
    const newName = `New System ${systemsArray.length + 1}`;
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
    <div className="min-h-screen bg-[#030308] text-white flex flex-col font-sans selection:bg-blue-500/30">
      {/* Canvas Background */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none">
        <Canvas
          shadows
          camera={{ position: [80, 180, 40], rotation: [-Math.PI / 2, 0, 0], fov: 45, far: 10000 }}>
          <System />
        </Canvas>
      </div>

      <header className="relative z-50 grid grid-cols-3 items-center px-8 py-6 w-full max-w-7xl mx-auto">
        <div />
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
            Space Sandbox
          </h1>
        </div>
        <div className="flex justify-end">
          {user ? (
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold uppercase text-xs">
                {user.username.charAt(0)}
              </div>
              <span className="font-medium text-sm text-gray-200">{user.username}</span>
              <button
                onClick={logout}
                className="text-sm text-red-400/70 hover:text-red-400 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 px-6 py-2 rounded-lg font-bold tracking-widest uppercase transition-all">
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Glass Container */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 w-full">
        {/* Фіксована висота контейнера (наприклад, 80% екрану) */}
        <div className="w-full max-w-4xl h-[80vh] bg-[#0a0a10]/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative flex flex-col overflow-hidden">
          {/* Subtle light effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Tabs (Фіксовані зверху) */}
          <div className="flex justify-center gap-2 mb-8 relative flex-shrink-0">
            {['default', 'community', 'my'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all border ${
                  activeTab === tab
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                }`}>
                {tab.replace('my', 'My Systems')}
              </button>
            ))}
          </div>

          {/* Скролібельна область (Grid) */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {activeTab === 'my' && !user ? (
                <div className="col-span-full flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-white/5 rounded-2xl border-dashed">
                  <h3 className="text-lg font-bold text-gray-200 mb-2">Authentication Required</h3>
                  <p className="text-white/40 mb-6 max-w-sm text-sm">
                    Log in to manage your personal system collection.
                  </p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-xs tracking-widest uppercase transition-colors">
                    Log In
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
                <div className="col-span-full flex items-center justify-center text-white/20 italic text-sm py-20">
                  No systems found in this category.
                </div>
              )}
            </div>
          </div>

          {/* Create Button (Фіксований знизу) */}
          <div className="mt-8 flex justify-center border-t border-white/5 pt-8 flex-shrink-0">
            <button
              onClick={handleCreate}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold tracking-widest uppercase text-sm transition-all shadow-lg shadow-blue-900/20">
              Create New System
            </button>
          </div>
        </div>
      </main>

      <Loader containerStyles={{ background: '#030308', zIndex: 40 }} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
