import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    StickyNote,
    GraduationCap,
    DollarSign,
    BookOpen,
    Plus,
    TrendingUp,
    Calendar,
    Target
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
// Temporary inline API functions
const api = {
    get: (url) => fetch(`http://localhost:8000/api${url}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
};

const collectionsAPI = {
    getAll: async () => {
        const response = await api.get("/collections");
        return { data: response.data || response };
    }
};

const notesAPI = {
    getAll: async () => {
        const response = await api.get("/notes");
        return { data: response.data || response };
    }
};
import NotesCard from './notes/NotesCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        collectionsCount: 0,
        notesCount: 0,
        universitiesCount: 0,
        scholarshipsCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [collectionsResponse, notesResponse] = await Promise.all([
                collectionsAPI.getAll(),
                notesAPI.getAll()
            ]);

            setStats(prev => ({
                ...prev,
                collectionsCount: collectionsResponse.data.length,
                notesCount: notesResponse.data.length
            }));
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const dashboardCards = [
        {
            title: 'Notes',
            description: 'Organize your thoughts and ideas',
            icon: StickyNote,
            color: 'from-purple-500 to-indigo-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            link: '/dashboard/notes',
            stats: { collections: stats.collectionsCount, notes: stats.notesCount }
        },
        {
            title: 'Universities',
            description: 'Explore and shortlist universities',
            icon: GraduationCap,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            link: '/universities',
            stats: { count: stats.universitiesCount }
        },
        {
            title: 'Scholarships',
            description: 'Find funding opportunities',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            link: '/scholarship',
            stats: { count: stats.scholarshipsCount }
        },
        {
            title: 'Learn',
            description: 'Educational resources and guides',
            icon: BookOpen,
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            link: '/learn',
            stats: { count: 0 }
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Here's what's happening with your US university application journey
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Notes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.notesCount}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Collections</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.collectionsCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <StickyNote className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Notes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.notesCount}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Universities</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.universitiesCount}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Scholarships</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.scholarshipsCount}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <BookOpen className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Resources</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Notes Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <NotesCard
                            collectionsCount={stats.collectionsCount}
                            notesCount={stats.notesCount}
                        />
                    </motion.div>

                    {/* Other Features */}
                    <div className="space-y-6">
                        {dashboardCards.slice(1).map((card, index) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                            >
                                <Link to={card.link} className="block">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-3 ${card.bgColor} rounded-xl`}>
                                                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                                                <p className="text-sm text-gray-500">{card.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {card.stats.count || card.stats.collections || 0}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {card.stats.count ? 'items' : card.stats.collections ? 'collections' : 'available'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`w-full py-3 px-4 bg-gradient-to-r ${card.color} text-white text-center rounded-xl font-medium hover:opacity-90 transition-opacity`}>
                                        Open {card.title}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/dashboard/notes"
                            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                        >
                            <Plus className="h-5 w-5 text-purple-600" />
                            <span className="text-purple-700 font-medium">Create New Note</span>
                        </Link>
                        <Link
                            to="/universities"
                            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                        >
                            <Plus className="h-5 w-5 text-blue-600" />
                            <span className="text-blue-700 font-medium">Add University</span>
                        </Link>
                        <Link
                            to="/scholarship"
                            className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                        >
                            <Plus className="h-5 w-5 text-green-600" />
                            <span className="text-green-700 font-medium">Find Scholarship</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
