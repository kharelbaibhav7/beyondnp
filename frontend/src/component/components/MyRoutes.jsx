import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HomePage from '../page/homePage/HomePage';

// Placeholder components - replace with actual components
const Dashboard = () => <div className="p-8">Dashboard Page</div>;
const Universities = () => <div className="p-8">Universities Page</div>;
const Scholarship = () => <div className="p-8">Scholarship Page</div>;
const Learn = () => <div className="p-8">Learn Page</div>;
const Profile = () => <div className="p-8">Profile Page</div>;
const Settings = () => <div className="p-8">Settings Page</div>;
const Login = () => <div className="p-8">Login Page</div>;
const Register = () => <div className="p-8">Register Page</div>;
const VerifyEmail = () => <div className="p-8">Verify Email Page</div>;
const ForgotPassword = () => <div className="p-8">Forgot Password Page</div>;
const ResetPassword = () => <div className="p-8">Reset Password Page</div>;
const NotFound = () => <div className="p-8 text-center">404 - Page Not Found</div>;

const MyRoutes = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Main App Routes */}
                <Route
                    path="/app"
                    element={
                        <div>
                            <Outlet />
                        </div>
                    }
                >
                    {isAuthenticated ? (
                        // Authenticated Routes
                        <>
                            <Route index element={<Dashboard />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="universities" element={<Universities />} />
                            <Route path="scholarship" element={<Scholarship />} />
                            <Route path="learn" element={<Learn />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<Settings />} />
                        </>
                    ) : (
                        // Unauthenticated Routes
                        <>
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="*" element={<NotFound />} />
                        </>
                    )}
                </Route>

                {/* Direct Routes for easier navigation */}
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
                <Route path="/universities" element={isAuthenticated ? <Universities /> : <Login />} />
                <Route path="/scholarship" element={isAuthenticated ? <Scholarship /> : <Login />} />
                <Route path="/learn" element={isAuthenticated ? <Learn /> : <Login />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
                <Route path="/settings" element={isAuthenticated ? <Settings /> : <Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default MyRoutes;
