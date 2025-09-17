import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HomePage from '../page/homePage/HomePage';

// Account Components
import Login from '../page/account/Login';
import SignUp from '../page/account/SignUp';
import VerifyEmail from '../page/account/VerifyEmail';
import Logout from '../page/account/Logout';
import ForgotPassword from '../page/account/ForgotPassword';
import ResetPassword from '../page/account/ResetPassword';

// Dashboard Components
import Dashboard from '../page/dashboard/Dashboard';

// Notes Components
import CollectionsPage from '../page/dashboard/notes/CollectionsPage';
import NotesPage from '../page/dashboard/notes/NotesPage';

// Placeholder components - replace with actual components
const Universities = () => <div className="p-8">Universities Page</div>;
const Scholarship = () => <div className="p-8">Scholarship Page</div>;
const Learn = () => <div className="p-8">Learn Page</div>;
const Profile = () => <div className="p-8">Profile Page</div>;
const Settings = () => <div className="p-8">Settings Page</div>;
const NotFound = () => <div className="p-8 text-center">404 - Page Not Found</div>;

const MyRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />

            {/* Notes Routes */}
            <Route
                path="/dashboard/notes"
                element={isAuthenticated ? <CollectionsPage /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/dashboard/notes/collection/:collectionId"
                element={isAuthenticated ? <NotesPage /> : <Navigate to="/login" replace />}
            />

            <Route
                path="/universities"
                element={isAuthenticated ? <Universities /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/scholarship"
                element={isAuthenticated ? <Scholarship /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/learn"
                element={isAuthenticated ? <Learn /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/profile"
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/settings"
                element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />}
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default MyRoutes;
