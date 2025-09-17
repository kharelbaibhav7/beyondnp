import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertTriangle, CheckCircle } from 'lucide-react';
import { authAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const Logout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const navigate = useNavigate();
    const { logout, user } = useAuth();

    useEffect(() => {
        // If user is not authenticated, redirect to login
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            // Call logout API (if needed for server-side cleanup)
            // authAPI.logout(); // This is client-side only for JWT

            // Clear local storage and context
            logout();

            toast.success('Logged out successfully!');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmLogout = () => {
        setShowConfirmation(true);
    };

    const handleCancelLogout = () => {
        setShowConfirmation(false);
    };

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full space-y-8"
            >
                {/* Header */}
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto h-16 w-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6"
                    >
                        <LogOut className="h-8 w-8 text-white" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Sign Out
                    </h2>
                    <p className="text-gray-600">
                        Are you sure you want to sign out?
                    </p>
                </div>

                {/* User Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-lg p-6 shadow-lg border border-gray-200"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Confirmation Dialog */}
                {showConfirmation ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg p-6 shadow-lg border border-gray-200"
                    >
                        <div className="flex items-start space-x-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-orange-500 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Confirm Sign Out
                                </h3>
                                <p className="text-gray-600">
                                    You will need to sign in again to access your account and continue your journey.
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Signing Out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Yes, Sign Out
                                    </>
                                )}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCancelLogout}
                                disabled={isLoading}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConfirmLogout}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Sign Out
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 flex items-center justify-center"
                        >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Stay Signed In
                        </motion.button>
                    </motion.div>
                )}

                {/* Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center"
                >
                    <p className="text-sm text-gray-500">
                        Your data is safe and will be available when you sign back in.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Logout;