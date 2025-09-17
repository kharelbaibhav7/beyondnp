import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StickyNote, Plus, FileText, Folder } from 'lucide-react';

const NotesCard = ({ collectionsCount = 0, notesCount = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                        <StickyNote className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Notes</h3>
                        <p className="text-sm text-gray-500">Organize your thoughts</p>
                    </div>
                </div>
                <Link
                    to="/dashboard/notes"
                    className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                >
                    <Plus className="h-5 w-5 text-purple-600" />
                </Link>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Folder className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Collections</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{collectionsCount}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Notes</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{notesCount}</span>
                </div>
            </div>

            <motion.div
                whileHover={{ scale: 1.01 }}
                className="mt-4"
            >
                <Link
                    to="/dashboard/notes"
                    className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                >
                    Open Notes
                </Link>
            </motion.div>
        </motion.div>
    );
};

export default NotesCard;
