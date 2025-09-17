import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { authAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errors, setErrors] = useState({});
    const [countdown, setCountdown] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const email = location.state?.email || '';
    const name = location.state?.name || '';

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only allow 6 digits
        setVerificationCode(value);

        // Clear error when user starts typing
        if (errors.code) {
            setErrors(prev => ({
                ...prev,
                code: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!verificationCode) {
            newErrors.code = 'Verification code is required';
        } else if (verificationCode.length !== 6) {
            newErrors.code = 'Verification code must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await authAPI.verifyEmail({
                email,
                verificationCode
            });

            if (response.success) {
                // Update auth context with user data and token
                login(response.data, response.data.token);

                toast.success('Email verified successfully! Welcome to BeyondNP!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Verification error:', error);

            if (error.response?.data?.message) {
                if (error.response.data.message.includes('invalid') || error.response.data.message.includes('expired')) {
                    toast.error('Invalid or expired verification code. Please try again.');
                } else {
                    toast.error(error.response.data.message);
                }
            } else {
                toast.error('Verification failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (countdown > 0) return;

        setIsResending(true);
        try {
            const response = await authAPI.resendVerification(email);

            if (response.success) {
                toast.success('Verification code sent successfully!');
                setCountdown(60); // 60 seconds cooldown
            }
        } catch (error) {
            console.error('Resend error:', error);
            toast.error('Failed to resend verification code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

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
                        className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6"
                    >
                        <Mail className="h-8 w-8 text-white" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Verify Your Email
                    </h2>
                    <p className="text-gray-600">
                        {name ? `Hi ${name}! ` : ''}We sent a 6-digit verification code to
                    </p>
                    <p className="text-purple-600 font-medium">
                        {email}
                    </p>
                    {location.state?.fromLogin && (
                        <p className="text-sm text-green-600 mt-2">
                            ✓ A new verification code has been sent to your email
                        </p>
                    )}
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Code
                        </label>
                        <div className="relative">
                            <input
                                id="verificationCode"
                                name="verificationCode"
                                type="text"
                                inputMode="numeric"
                                value={verificationCode}
                                onChange={handleChange}
                                className={`block w-full px-4 py-4 text-center text-2xl font-mono tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.code ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="000000"
                                maxLength={6}
                            />
                        </div>
                        {errors.code && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center mt-2 text-sm text-red-600"
                            >
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.code}
                            </motion.div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading || verificationCode.length !== 6}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Verifying...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                Verify Email
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                        )}
                    </motion.button>

                    {/* Resend Code */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Didn't receive the code?
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending || countdown > 0}
                            className="text-sm text-purple-600 hover:text-purple-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center mx-auto"
                        >
                            {isResending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                                    Sending...
                                </>
                            ) : countdown > 0 ? (
                                `Resend in ${countdown}s`
                            ) : (
                                <>
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Resend Code
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Back to Register */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Wrong email?{' '}
                            <Link
                                to="/register"
                                className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                            >
                                Go back to registration
                            </Link>
                        </p>
                    </div>
                </motion.form>

                {/* Help Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                    <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Check your email</p>
                            <p>Make sure to check your spam folder if you don't see the email in your inbox.</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;