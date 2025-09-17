import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    ArrowLeft,
    MoreVertical,
    Edit3,
    Trash2,
    Tag,
    Calendar,
    X,
    Menu,
    X as CloseIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

// Temporary inline API functions with proper error handling
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
        console.log('🌐 FETCH POST CALLED');
        console.log('=== Fetch POST Debug ===');
        console.log('URL:', `http://localhost:8000/api${url}`);
        console.log('Data being sent:', data);
        console.log('JSON body:', JSON.stringify(data));
        console.log('Token:', localStorage.getItem('token'));

        const response = await fetch(`http://localhost:8000/api${url}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error data:', errorData);
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

const notesAPI = {
    getByCollection: async (collectionId) => {
        try {
            const response = await api.get(`/notes?collectionId=${collectionId}`);
            return { data: response.data || [] };
        } catch (error) {
            console.error('API Error fetching notes:', error);
            throw error;
        }
    },
    create: async (noteData) => {
        try {
            console.log('🔥 API CREATE NOTE CALLED');
            console.log('=== API Create Note Debug ===');
            console.log('Data being sent to API:', noteData);
            console.log('JSON stringified:', JSON.stringify(noteData));
            console.log('Title exists:', !!noteData.title);
            console.log('Content exists:', !!noteData.content);
            console.log('CollectionId exists:', !!noteData.collectionId);
            console.log('Title value:', noteData.title);
            console.log('Content value:', noteData.content);
            console.log('CollectionId value:', noteData.collectionId);

            const response = await api.post("/notes", noteData);
            console.log('API Response received:', response);
            console.log('Response type:', typeof response);
            console.log('Response keys:', Object.keys(response || {}));

            return { data: response.data || response };
        } catch (error) {
            console.error('API Error creating note:', error);
            console.error('Error message:', error.message);
            console.error('Error response:', error.response);
            console.error('Error status:', error.status);
            throw error;
        }
    },
    update: async (id, noteData) => {
        try {
            const response = await api.put(`/notes/${id}`, noteData);
            return { data: response.note || response.data || response };
        } catch (error) {
            console.error('API Error updating note:', error);
            throw error;
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/notes/${id}`);
            return { data: response };
        } catch (error) {
            console.error('API Error deleting note:', error);
            throw error;
        }
    }
};

const collectionsAPI = {
    getById: async (id) => {
        try {
            const response = await api.get(`/collections/${id}`);
            // Backend returns { success, data: { collection, notes } }
            const collection = (response && response.data && response.data.collection)
                ? response.data.collection
                : (response && response.collection) // fallback if already unwrapped
                    ? response.collection
                    : null;
            return { data: { collection } };
        } catch (error) {
            console.error('API Error fetching collection:', error);
            throw error;
        }
    }
};

const NotesPage = () => {
    const { collectionId } = useParams();
    const navigate = useNavigate();

    const [collection, setCollection] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    // Single list view (no grid/list toggle)
    const [editingNote, setEditingNote] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    // Note colors
    const noteColors = [
        '#4800FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
    ];

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        fetchCollectionAndNotes();
    }, [collectionId]);

    const fetchCollectionAndNotes = async () => {
        try {
            setLoading(true);
            const [collectionResponse, notesResponse] = await Promise.all([
                collectionsAPI.getById(collectionId),
                notesAPI.getByCollection(collectionId)
            ]);

            setCollection(collectionResponse.data.collection);
            setNotes(notesResponse.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load collection and notes');
            navigate('/dashboard/notes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNoteDirectly = async () => {
        try {
            console.log('Creating note directly...');
            const newNoteData = {
                title: 'New Note',
                content: '',
                tags: ['note'],
                color: '#4800FF',
                isPinned: false
            };

            const response = await notesAPI.create({
                ...newNoteData,
                collectionId: collectionId
            });

            if (response && response.data) {
                setNotes(prev => [response.data, ...(prev || [])]);
                toast.success('Note created successfully!');
                setSelectedNote(response.data);
                if (isMobile) {
                    setShowNoteEditor(true);
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error creating note:', error);
            toast.error(error.message || 'Failed to create note');
        }
    };

    const handleCreateNote = async (id, noteData) => {
        try {
            console.log('🎯 HANDLE CREATE NOTE CALLED');
            console.log('=== Creating Note Debug ===');
            console.log('ID parameter:', id);
            console.log('NoteData parameter:', noteData);
            console.log('Collection ID from params:', collectionId);
            console.log('Collection ID type:', typeof collectionId);
            console.log('Collection ID length:', collectionId?.length);

            // Use noteData if it exists, otherwise use the first parameter
            const actualNoteData = noteData || id;

            const finalData = {
                ...actualNoteData,
                collectionId: collectionId
            };

            console.log('Final data being sent:', finalData);
            console.log('Title:', finalData.title);
            console.log('Content:', finalData.content);
            console.log('CollectionId:', finalData.collectionId);
            console.log('All keys in finalData:', Object.keys(finalData));
            console.log('Actual note data used:', actualNoteData);

            const response = await notesAPI.create(finalData);

            if (response && response.data) {
                setNotes(prev => [response.data, ...(prev || [])]);
                toast.success('Note created successfully!');
                setShowCreateModal(false);
                setSelectedNote(response.data);
                if (isMobile) {
                    setShowNoteEditor(true);
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error creating note:', error);
            toast.error(error.message || 'Failed to create note');
        }
    };

    const handleUpdateNote = async (id, noteData) => {
        try {
            const response = await notesAPI.update(id, noteData);
            setNotes(prev => prev.map(note =>
                note._id === id ? response.data : note
            ));
            toast.success('Note updated successfully!');
            setEditingNote(null);
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error(error.message || 'Failed to update note');
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await notesAPI.delete(id);
            setNotes(prev => prev.filter(note => note._id !== id));
            if (selectedNote && selectedNote._id === id) {
                setSelectedNote(null);
                setShowNoteEditor(false);
            }
            toast.success('Note deleted successfully!');
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error(error.message || 'Failed to delete note');
        }
    };

    const handleNoteSelect = (note) => {
        setSelectedNote(note);
        if (isMobile) {
            setShowNoteEditor(true);
        }
    };

    const filteredNotes = (notes || []).filter(note => {
        if (!note) return false;
        const searchLower = searchQuery.toLowerCase();
        return (
            (note.title || '').toLowerCase().includes(searchLower) ||
            (note.content || '').toLowerCase().includes(searchLower) ||
            (note.tags || []).some(tag =>
                (tag || '').toLowerCase().includes(searchLower)
            )
        );
    });

    const regularNotes = filteredNotes;

    // Debug logging
    console.log('NotesPage render - loading:', loading);
    console.log('NotesPage render - collection:', collection);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Consistent with CollectionsPage */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard/notes')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {collection?.name || 'Collection'}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {isMobile && !showNoteEditor && (
                                <button
                                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    console.log('New Note button clicked!');
                                    handleCreateNoteDirectly();
                                }}
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>New Note</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Full-Screen Note Editor */}
            {isMobile && showNoteEditor && selectedNote ? (
                <div className="fixed inset-0 z-50 bg-white">
                    <NoteEditor
                        note={selectedNote}
                        onUpdate={handleUpdateNote}
                        onClose={() => {
                            setShowNoteEditor(false);
                        }}
                        isMobile={isMobile}
                    />
                </div>
            ) : (
                <div className="flex h-[calc(100vh-80px)]">
                    {/* Left Pane - Notes List */}
                    <div className={`${isMobile ? 'fixed inset-0 z-40 bg-white' : 'w-1/3 min-w-0'} ${showMobileSidebar || !isMobile ? 'block' : 'hidden'}`}>
                        <div className="h-full flex flex-col">
                            {/* Search */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search notes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Notes List */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {regularNotes.length > 0 && (
                                    <div className={`space-y-2`}>
                                        {regularNotes.map(note => (
                                            <NoteCard
                                                key={note._id}
                                                note={note}
                                                isSelected={selectedNote?._id === note._id}
                                                onSelect={() => handleNoteSelect(note)}
                                                onDelete={() => handleDeleteNote(note._id)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {filteredNotes.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <Edit3 className="h-12 w-12 mx-auto" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
                                        <p className="text-gray-500">
                                            {searchQuery ? 'Try adjusting your search' : 'Create your first note to get started'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Close Button */}
                        {isMobile && (
                            <button
                                onClick={() => setShowMobileSidebar(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <CloseIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Right Pane - Note Details (Desktop only) */}
                    {!isMobile && (
                        <div className="w-2/3 min-w-0">
                            {selectedNote ? (
                                <NoteEditor
                                    note={selectedNote}
                                    onUpdate={handleUpdateNote}
                                    onClose={() => {
                                        setSelectedNote(null);
                                    }}
                                    isMobile={isMobile}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center bg-gray-50">
                                    <div className="text-center">
                                        <div className="text-gray-400 mb-4">
                                            <Edit3 className="h-16 w-16 mx-auto" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">Select a note</h3>
                                        <p className="text-gray-500">Choose a note from the list to view and edit it</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

// Note Card Component
const NoteCard = ({ note, isSelected, onSelect, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative group cursor-pointer p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm ${isSelected ? 'ring-2 ring-purple-500 border-purple-500' : ''}`}
            onClick={onSelect}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                            {note.title || 'Untitled'}
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {note.content || 'No content'}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {note.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
            </div>

            {showMenu && (
                <div className="absolute right-2 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                        className="hidden"
                    >Hidden</button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                            setShowMenu(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                    </button>
                </div>
            )}
        </motion.div>
    );
};

// Note Editor Component
const NoteEditor = ({ note, onUpdate, onClose, isMobile }) => {
    const [formData, setFormData] = useState({
        title: note?.title || '',
        content: note?.content || '',
        tags: note?.tags || [],
        color: note?.color || '#4800FF'
    });
    const [hasChanges, setHasChanges] = useState(false);
    const [tagInput, setTagInput] = useState('');

    // Reset form data when note changes
    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title || '',
                content: note.content || '',
                tags: note.tags || [],
                color: note.color || '#4800FF'
            });
            setTagInput('');
        }
    }, [note?._id]); // Reset when note ID changes

    useEffect(() => {
        setHasChanges(
            formData.title !== (note?.title || '') ||
            formData.content !== (note?.content || '') ||
            JSON.stringify(formData.tags) !== JSON.stringify(note?.tags || []) ||
            formData.color !== (note?.color || '#4800FF')
        );
    }, [formData, note]);

    const handleSave = async () => {
        try {
            await onUpdate(note._id, formData);
            setHasChanges(false);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleTagAdd = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Minimal Editor Header (mobile): back + save only */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center space-x-2">
                            {isMobile && (
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            {hasChanges && (
                                <button
                                    onClick={handleSave}
                                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <span>Save</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-4 sm:p-6">
                <div className="space-y-4">
                    {/* Hidden title input for form data */}
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Note title..."
                        className="w-full text-2xl font-bold text-gray-900 border-none outline-none bg-transparent"
                    />

                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                            placeholder="Add tags..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleTagAdd}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                >
                                    <span>{tag}</span>
                                    <button
                                        onClick={() => handleTagRemove(tag)}
                                        className="hover:text-purple-900"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Start writing your note..."
                        className="w-full h-64 sm:h-96 text-gray-700 border-none outline-none resize-none"
                    />
                </div>
            </div>
        </div>
    );
};


export default NotesPage;