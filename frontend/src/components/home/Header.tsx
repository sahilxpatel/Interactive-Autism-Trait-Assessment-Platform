// src/components/home/Header.tsx
import { motion } from 'framer-motion';
import { BrainCircuit, Menu, X, ChevronDown, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveNav('');
      return;
    }

    const handleScroll = () => {
      const sections = ['home', 'about', 'resources', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveNav(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleNavClick = (section: string) => {
    setActiveNav(section);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    if (section === 'home' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'home') {
      navigate('/');
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const navItems = [
    { 
      id: 'home', 
      label: 'Home',
      description: 'Begin your autism assessment journey',
      content: [
        { 
          title: 'Take Assessment', 
          desc: 'Complete our screening questionnaire',
          action: () => navigate('/test')
        }
      ]
    },
    { 
      id: 'about', 
      label: 'About',
      description: 'Learn about our evidence-based approach',
      content: []
    },
    { 
      id: 'resources', 
      label: 'Resources',
      description: 'Educational materials and support',
      content: []
    },
    { 
      id: 'contact', 
      label: 'Contact',
      description: 'Get in touch with our team',
      content: []
    },
  ];

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => {
            setActiveNav('home');
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <BrainCircuit size={36} className="text-blue-600" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Autism Assessment
          </h1>
        </div>
        
        <nav className="hidden md:flex space-x-2">
          {navItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => setOpenDropdown(item.id)}
                className={`transition-colors font-medium relative py-1 px-4 rounded-lg ${
                  activeNav === item.id
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  {item.label}
                  <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
                </div>
                {activeNav === item.id && (
                  <motion.div 
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium"
          >
            Login
          </button>
          <motion.button 
            onClick={() => navigate('/test')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Take Assessment
          </motion.button>
        </div>

        <button 
          className="md:hidden p-2 text-gray-600 hover:text-blue-500 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
