import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
    };

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/case-stories', label: 'Case Stories' },
        { path: '/support-directory', label: 'Support Directory' },
    ];

    const authenticatedNavItems = [
        { path: '/legal-advisor', label: 'Legal Advisor' },
        { path: '/appeal-generator', label: 'Appeal Generator' },
        { path: '/story-wall', label: 'Story Wall' },
    ];

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="container-responsive">
                <div className="flex justify-between h-16 lg:h-20">
                    {/* Logo and main nav */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Netsanet</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${isActive(item.path)
                                        ? 'nav-link-active'
                                        : 'nav-link-inactive'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {isAuthenticated && !isAdmin && authenticatedNavItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${isActive(item.path)
                                            ? 'nav-link-active'
                                            : 'nav-link-inactive'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Auth buttons and user menu */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus-visible p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium">{user?.username}</span>
                                </button>

                                {/* User Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200">
                                        <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                                            <div className="font-semibold text-gray-900">{user?.username}</div>
                                            <div className="text-gray-500 text-xs sm:text-sm">{user?.email}</div>
                                            {isAdmin && (
                                                <div className="flex items-center mt-2">
                                                    <Shield className="w-3 h-3 text-primary-500 mr-2" />
                                                    <span className="text-xs text-primary-600 font-medium">Administrator</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* My Dashboard - Only for non-admin users */}
                                        {!isAdmin && (
                                            <Link
                                                to="/my-dashboard"
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                My Dashboard
                                            </Link>
                                        )}

                                        {/* Admin Dashboard - Only for admins */}
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <LogOut className="w-4 h-4 inline mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible transition-colors duration-200"
                            >
                                {isMenuOpen ? (
                                    <X className="block h-6 w-6" />
                                ) : (
                                    <Menu className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {isMenuOpen && (
                <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />
            )}

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-50">
                    <div className="px-4 py-6 space-y-4">
                        {/* Navigation Links */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                                Navigation
                            </h3>
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${isActive(item.path)
                                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Authenticated Navigation Links */}
                        {isAuthenticated && !isAdmin && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                                    Tools
                                </h3>
                                {authenticatedNavItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${isActive(item.path)
                                                ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* User Actions */}
                        <div className="pt-4 border-t border-gray-200">
                            {!isAuthenticated ? (
                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* User Info */}
                                    <div className="px-3 py-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{user?.username}</div>
                                                <div className="text-sm text-gray-500">{user?.email}</div>
                                                {isAdmin && (
                                                    <div className="flex items-center mt-1">
                                                        <Shield className="w-3 h-3 text-primary-500 mr-1" />
                                                        <span className="text-xs text-primary-600 font-medium">Admin</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dashboard Links */}
                                    {!isAdmin && (
                                        <Link
                                            to="/my-dashboard"
                                            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            My Dashboard
                                        </Link>
                                    )}
                                    
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    {/* Sign Out */}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <LogOut className="w-4 h-4 inline mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 