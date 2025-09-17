import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Folder,
    MoreVertical,
    Edit3,
    Archive,
    Trash2,
    ArrowLeft,
    Grid3X3,
    List,
    Filter
} from 'lucide-react';
// Temporary inline API functions
const api = {
    get: async (url) => {
        const response = await fetch(`http://localhost:8000/api${url}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    post: async (url, data) => {
        const response = await fetch(`http://localhost:8000/api${url}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    put: async (url, data) => {
        const response = await fetch(`http://localhost:8000/api${url}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    delete: async (url) => {
        const response = await fetch(`http://localhost:8000/api${url}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
};

const collectionsAPI = {
    getAll: async () => {
        try {
            const response = await api.get("/collections");
            return { data: response.data || response };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    create: async (collectionData) => {
        try {
            console.log('=== API Create Collection Debug ===');
            console.log('Data being sent to API:', collectionData);
            console.log('JSON stringified:', JSON.stringify(collectionData));

            const response = await api.post("/collections", collectionData);
            console.log('API Response received:', response);
            console.log('Response type:', typeof response);
            console.log('Response keys:', Object.keys(response || {}));

            return { data: response.data || response };
        } catch (error) {
            console.error('API Error creating collection:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.status);
            throw error;
        }
    },
    update: async (id, collectionData) => {
        try {
            const response = await api.put(`/collections/${id}`, collectionData);
            return { data: response.data || response };
        } catch (error) {
            console.error('API Error updating collection:', error);
            throw error;
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/collections/${id}`);
            return { data: response.data || response };
        } catch (error) {
            console.error('API Error deleting collection:', error);
            throw error;
        }
    }
};
import toast from 'react-hot-toast';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [showMenu, setShowMenu] = useState(null);

    const navigate = useNavigate();

    // Collection colors and icons
    const collectionColors = [
        '#4800FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
    ];

    const collectionIcons = [
        'folder', 'book', 'heart', 'star', 'lightbulb', 'target', 'zap', 'shield'
    ];

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const response = await collectionsAPI.getAll();
            setCollections(response.data || []);
        } catch (error) {
            console.error('Error fetching collections:', error);
            toast.error('Failed to load collections');
            setCollections([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCollection = async (collectionData) => {
        try {
            console.log('=== Collection Creation Debug ===');
            console.log('Collection data being sent:', collectionData);
            console.log('Data type:', typeof collectionData);
            console.log('Data keys:', Object.keys(collectionData));
            console.log('Name value:', collectionData.name);
            console.log('Name type:', typeof collectionData.name);
            console.log('Name length:', collectionData.name?.length);

            const response = await collectionsAPI.create(collectionData);
            console.log('Response received:', response);

            if (response && response.data) {
                setCollections(prev => [response.data, ...(prev || [])]);
                toast.success('Collection created successfully!');
                setShowCreateModal(false);
            } else {
                console.error('Invalid response structure:', response);
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error creating collection:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });

            if (error.message) {
                toast.error(error.message);
            } else if (error.error) {
                toast.error(error.error);
            } else {
                toast.error('Failed to create collection. Please try again.');
            }
        }
    };

    const handleUpdateCollection = async (id, collectionData) => {
        try {
            const response = await collectionsAPI.update(id, collectionData);
            setCollections(prev =>
                (prev || []).map(collection =>
                    collection._id === id ? response.data : collection
                )
            );
            toast.success('Collection updated successfully!');
            setEditingCollection(null);
        } catch (error) {
            console.error('Error updating collection:', error);
            toast.error(error.message || 'Failed to update collection');
        }
    };

    const handleDeleteCollection = async (id) => {
        if (!window.confirm('Are you sure you want to delete this collection? All notes in this collection will also be deleted.')) {
            return;
        }

        try {
            await collectionsAPI.delete(id);
            setCollections(prev => (prev || []).filter(collection => collection._id !== id));
            toast.success('Collection deleted successfully!');
        } catch (error) {
            console.error('Error deleting collection:', error);
            toast.error(error.message || 'Failed to delete collection');
        }
    };

    const handleArchiveCollection = async (id) => {
        try {
            await collectionsAPI.update(id, { isArchived: true });
            setCollections(prev => (prev || []).filter(collection => collection._id !== id));
            toast.success('Collection archived successfully!');
        } catch (error) {
            console.error('Error archiving collection:', error);
            toast.error(error.message || 'Failed to archive collection');
        }
    };

    const filteredCollections = (collections || []).filter(collection =>
        collection?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading collections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
                                <p className="text-sm text-gray-500">Organize your notes into collections</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>New Collection</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search collections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Collections Grid/List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {filteredCollections.length === 0 ? (
                    <div className="text-center py-12">
                        <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery ? 'No collections found' : 'No collections yet'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchQuery
                                ? 'Try adjusting your search terms'
                                : 'Create your first collection to start organizing your notes'
                            }
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Create Collection
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-4'
                    }>
                        <AnimatePresence>
                            {filteredCollections.map((collection) => (
                                <CollectionCard
                                    key={collection._id}
                                    collection={collection}
                                    viewMode={viewMode}
                                    onEdit={setEditingCollection}
                                    onDelete={handleDeleteCollection}
                                    onArchive={handleArchiveCollection}
                                    onMenuToggle={(id) => setShowMenu(showMenu === id ? null : id)}
                                    showMenu={showMenu === collection._id}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || editingCollection) && (
                <CollectionModal
                    collection={editingCollection}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingCollection(null);
                    }}
                    onSave={editingCollection ? handleUpdateCollection : handleCreateCollection}
                    colors={collectionColors}
                    icons={collectionIcons}
                />
            )}
        </div>
    );
};

// Collection Card Component
const CollectionCard = ({
    collection,
    viewMode,
    onEdit,
    onDelete,
    onArchive,
    onMenuToggle,
    showMenu
}) => {
    const navigate = useNavigate();

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => navigate(`/dashboard/notes/collection/${collection._id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-100 cursor-pointer"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: collection.color + '20' }}
                        >
                            <Folder
                                className="h-6 w-6"
                                style={{ color: collection.color }}
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                            <p className="text-sm text-gray-500">{collection.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-400">
                                    {collection.notesCount} notes
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatDate(collection.lastModified)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <button
                                onClick={() => onMenuToggle(collection._id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    <button
                                        onClick={() => {
                                            onEdit(collection);
                                            onMenuToggle(collection._id);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onArchive(collection._id);
                                            onMenuToggle(collection._id);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                    >
                                        <Archive className="h-4 w-4" />
                                        <span>Archive</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(collection._id);
                                            onMenuToggle(collection._id);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/dashboard/notes/collection/${collection._id}`)}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 relative group cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: collection.color + '20' }}
                >
                    <Folder
                        className="h-6 w-6"
                        style={{ color: collection.color }}
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => onMenuToggle(collection._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                                onClick={() => {
                                    onEdit(collection);
                                    onMenuToggle(collection._id);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                            >
                                <Edit3 className="h-4 w-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => {
                                    onArchive(collection._id);
                                    onMenuToggle(collection._id);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                            >
                                <Archive className="h-4 w-4" />
                                <span>Archive</span>
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(collection._id);
                                    onMenuToggle(collection._id);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">{collection.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{collection.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{collection.notesCount} notes</span>
                <span>{formatDate(collection.lastModified)}</span>
            </div>

            {/* Card opens on click; footer button removed */}
        </motion.div>
    );
};

// Collection Modal Component
const CollectionModal = ({ collection, onClose, onSave, colors, icons }) => {
    const [formData, setFormData] = useState({
        name: collection?.name || '',
        description: collection?.description || '',
        color: collection?.color || colors[0],
        icon: collection?.icon || icons[0]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('=== Form Submit Debug ===');
        console.log('Form data:', formData);
        console.log('Name trimmed:', formData.name.trim());
        console.log('Name length:', formData.name.trim().length);
        console.log('Is submitting:', isSubmitting);

        if (!formData.name.trim() || isSubmitting) {
            console.log('Form validation failed or already submitting');
            return;
        }

        setIsSubmitting(true);
        try {
            if (collection) {
                console.log('Updating collection with ID:', collection._id);
                await onSave(collection._id, formData);
            } else {
                console.log('Creating new collection');
                await onSave(formData);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {collection ? 'Edit Collection' : 'Create New Collection'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Collection Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter collection name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter description (optional)"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                        </label>
                        <div className="flex space-x-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                                    className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-400' : 'border-gray-200'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isSubmitting && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            <span>{collection ? 'Update' : 'Create'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CollectionsPage;
