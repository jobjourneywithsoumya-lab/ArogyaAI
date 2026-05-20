import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, X, ShoppingCart, Activity, FileText, MapPin, BookOpen, Stethoscope, LogOut, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealth } from '../context/useHealth';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants/brand';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useHealth();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <Activity className="w-4 h-4" /> },
    { name: 'Pharmacy', path: '/pharmacy', icon: <ShoppingCart className="w-4 h-4" /> },
    { name: 'Records', path: '/records', icon: <FileText className="w-4 h-4" /> },
    { name: 'Tracker', path: '/tracker', icon: <Activity className="w-4 h-4" /> },
    { name: 'Hospitals', path: '/hospitals', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Doctors', path: '/doctors', icon: <Stethoscope className="w-4 h-4" /> },
    { name: 'Awareness', path: '/awareness', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Wellness AI', path: '/wellness-ai', icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-white shadow-lg' : 'bg-gradient-to-b from-blue-50 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition" onClick={() => setIsMobileMenuOpen(false)}>
            <BrandLogo size={36} className="rounded-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Link to="/pharmacy" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {state.cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {state.cart.length}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">{user?.fullName}</span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold text-gray-800">{user?.fullName}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                    <User size={18} />
                    <span>My Profile</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 border-t"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-t shadow-lg"
        >
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`block px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon} {link.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors border-t mt-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
