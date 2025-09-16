import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Home,
    GraduationCap,
    DollarSign,
    BookOpen,
    User,
    LogIn,
    LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Universities', href: '/universities', icon: GraduationCap },
        { name: 'Scholarship', href: '/scholarship', icon: DollarSign },
        { name: 'Learn', href: '/learn', icon: BookOpen },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0"
                    >
                        <Link to="/" className="flex items-center space-x-3">
                            <img src={logo} alt="Beyond NP Logo" className="w-10 h-10" />
                            <span className="text-2xl font-bold text-gray-900">Beyond NP</span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation - Only show when authenticated */}
                    {isAuthenticated && (
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(item.href)
                                                ? 'text-purple-600 bg-purple-50'
                                                : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* User Menu / Auth Buttons */}
                    <div className="hidden md:block">
                        {isAuthenticated ? (
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleUserMenu}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">{user?.name || 'User'}</span>
                                </motion.button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                        >
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <User className="w-4 h-4 mr-3" />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <BookOpen className="w-4 h-4 mr-3" />
                                                Settings
                                            </Link>
                                            <hr className="my-1" />
                                            <button
                                                onClick={logout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all duration-200"
                                >
                                    <Link to="/register" className="flex items-center space-x-2">
                                        <LogIn className="w-4 h-4" />
                                        <span>Sign Up</span>
                                    </Link>
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white border-t border-gray-200"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {/* Mobile Navigation - Only show when authenticated */}
                            {isAuthenticated && navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive(item.href)
                                            ? 'text-purple-600 bg-purple-50'
                                            : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}

                            {/* Mobile Auth Section */}
                            <div className="pt-4 border-t border-gray-200">
                                {isAuthenticated ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3 px-3 py-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-base font-medium text-gray-900">
                                                {user?.name || 'User'}
                                            </span>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
                                        >
                                            <User className="w-5 h-5" />
                                            <span>Profile</span>
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="flex items-center w-full space-x-3 px-3 py-2 text-red-600 hover:bg-gray-50 rounded-md"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            <span>Sign In</span>
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            <span>Sign Up</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
