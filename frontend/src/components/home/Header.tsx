// src/components/home/Header.tsx
import { motion } from 'framer-motion';
import { BrainCircuit, Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand */}
        <button
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            if (location.pathname !== '/') navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Go home"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
            <BrainCircuit size={36} className="text-blue-600" />
          </motion.div>
          <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Autism Assessment
          </span>
        </button>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
          ) : user ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg transition"
                title="Profile"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-700 max-w-[160px] truncate">
                  {user.displayName || user.email}
                </span>
              </button>
              <button onClick={() => signOut(auth)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                Login
              </button>
              <motion.button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </motion.button>
            </>
          )}

          <motion.button
            onClick={() => navigate('/test')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Take Assessment
          </motion.button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-blue-500 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
