import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const { login, register } = useAuthStore();

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
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

    try {
      if (authMode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }

      setUsername('');
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthError(error.response?.data?.error || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0a0a10] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
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
            <p className="text-red-400 text-sm font-medium text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              {authError}
            </p>
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
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setAuthError('');
            }}
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
            {authMode === 'login' ? 'Register here' : 'Log in here'}
          </button>
        </div>
      </div>
    </div>
  );
}
