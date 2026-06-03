import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import System from '../components/3d/System';
import { useSystemStore } from '../store/useSystemStore';

export default function Home() {
  const navigate = useNavigate();
  const systems = useSystemStore((state) => state.systems);

  const currentUser = useSystemStore((state) => state.currentUser);
  const login = useSystemStore((state) => state.login);
  const logout = useSystemStore((state) => state.logout);

  const addSystem = useSystemStore((state) => state.addSystem);
  const deleteSystem = useSystemStore((state) => state.deleteSystem);
  const cloneSystem = useSystemStore((state) => state.cloneSystem);

  const [activeTab, setActiveTab] = useState<'default' | 'community' | 'my'>('default');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const filteredSystems = systems.filter((sys) => {
    if (activeTab === 'default') return sys.isDefault;
    if (activeTab === 'community') return sys.isPublic && !sys.isDefault;
    if (activeTab === 'my') return sys.authorId === currentUser?.id;
    return false;
  });

  const handleSystemClick = (id: string) => {
    navigate(`/sandbox/${id}`);
  };

  const handleCreate = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const newName = `New System ${systems.length + 1}`;
    addSystem(newName);
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
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    cloneSystem(id);
    setActiveTab('my');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (username.length < 3) {
      setAuthError('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 4) {
      setAuthError('Password must be at least 4 characters.');
      return;
    }
    if (authMode === 'register' && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    login(username);
    setIsAuthModalOpen(false);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#030308] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      {/* 3D ФОН */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <Canvas
          shadows
          camera={{ position: [80, 180, 40], rotation: [-Math.PI / 2, 0, 0], fov: 45, far: 10000 }}>
          <System />
        </Canvas>
      </div>

      <div className="absolute top-6 right-6 z-20">
        {currentUser ? (
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-200">{currentUser.name}</span>
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
          {activeTab === 'my' && !currentUser ? (
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
              <div
                key={sys.id}
                onClick={() => handleSystemClick(sys.id)}
                className="relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 p-6 rounded-2xl cursor-pointer transition-all duration-300 group flex flex-col items-center text-center">
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sys.authorId !== currentUser?.id && (
                    <button
                      onClick={(e) => handleClone(e, sys.id)}
                      className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
                      title="Clone to My Systems">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}

                  {sys.authorId === currentUser?.id && (
                    <button
                      onClick={(e) => handleDelete(e, sys.id)}
                      className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      title="Delete System">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
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

                <div
                  className="w-16 h-16 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4 flex items-center justify-center border-2 border-white/10"
                  style={{ backgroundColor: sys.star.color }}
                />
                <h3 className="text-lg font-bold text-gray-200">{sys.name}</h3>
              </div>
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

      <Loader containerStyles={{ background: '#030308', zIndex: 50 }} />

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a0a10] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-3xl font-black mb-2 uppercase tracking-widest text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
              {authMode === 'login' ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-white/50 text-center mb-8">
              {authMode === 'login'
                ? 'Enter your details to access your universe.'
                : 'Create an account to save your systems.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Commander123"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              )}

              {authError && (
                <p className="text-red-400 text-sm font-medium text-center">{authError}</p>
              )}

              <button
                type="submit"
                className="mt-4 w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold tracking-widest uppercase transition-colors shadow-lg shadow-blue-500/20">
                {authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/50">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                {authMode === 'login' ? 'Register here' : 'Log in here'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
