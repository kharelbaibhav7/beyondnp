import asyncHandler from "express-async-handler";
import Note from "../models/Note.js";
import Collection from "../models/Collection.js";

// @desc    Get all notes in a collection
// @route   GET /api/notes
// @access  Private
export const getNotes = asyncHandler(async (req, res) => {
  const { collectionId } = req.query;

  const query = {
    user: req.user._id,
    isArchived: false,
  };

  if (collectionId) {
    query.parentCollection = collectionId;
  }

  const notes = await Note.find(query)
    .sort({ isPinned: -1, lastModified: -1 })
    .populate("parentCollection", "name color icon");

  res.status(200).json({
    success: true,
    data: notes,
  });
});

// @desc    Get archived notes
// @route   GET /api/notes/archived
// @access  Private
export const getArchivedNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id,
    isArchived: true,
  })
    .sort({ lastModified: -1 })
    .populate("parentCollection", "name color icon");

  res.status(200).json({
    success: true,
    data: notes,
  });
});

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, collectionId, tags, color, isPinned } = req.body;

  if (!title || !content || !collectionId) {
    res.status(400);
    throw new Error("Please provide title, content and collection");
  }

  // Verify collection exists and belongs to user
  const collection = await Collection.findOne({
    _id: collectionId,
    user: req.user._id,
  });

  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  const note = await Note.create({
    user: req.user._id,
    parentCollection: collectionId,
    title,
    content,
    tags,
    color,
    isPinned,
  });

  // Update collection's lastModified
  collection.lastModified = new Date();
  await collection.save();

  res.status(201).json({
    success: true,
    data: note,
  });
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req, res) => {
  const { title, content, tags, color, isPinned, isArchived, collectionId } =
    req.body;

  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  // If moving to different collection, verify it exists and belongs to user
  if (collectionId && collectionId !== note.parentCollection.toString()) {
    const newCollection = await Collection.findOne({
      _id: collectionId,
      user: req.user._id,
    });

    if (!newCollection) {
      res.status(404);
      throw new Error("Target collection not found");
    }

    // Update old collection's notesCount and lastModified
    await Collection.findByIdAndUpdate(note.parentCollection, {
      $inc: { notesCount: -1 },
      lastModified: new Date(),
    });

    // Update new collection's notesCount and lastModified
    await Collection.findByIdAndUpdate(collectionId, {
      $inc: { notesCount: 1 },
      lastModified: new Date(),
    });

    note.parentCollection = collectionId;
  }

  note.title = title || note.title;
  note.content = content || note.content;
  note.tags = tags || note.tags;
  note.color = color || note.color;
  note.isPinned = isPinned ?? note.isPinned;
  note.isArchived = isArchived ?? note.isArchived;
  note.lastModified = new Date();

  await note.save();

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  // Update collection's notesCount and lastModified
  await Collection.findByIdAndUpdate(note.parentCollection, {
    $inc: { notesCount: -1 },
    lastModified: new Date(),
  });

  // Delete the note
  await Note.deleteOne({ _id: note._id });

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
});

// @desc    Get note by ID
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("parentCollection", "name color icon");

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc    Search notes
// @route   GET /api/notes/search
// @access  Private
export const searchNotes = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    res.status(400);
    throw new Error("Please provide a search query");
  }

  const notes = await Note.find({
    user: req.user._id,
    isArchived: false,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
    ],
  })
    .sort({ isPinned: -1, lastModified: -1 })
    .populate("parentCollection", "name color icon");

  res.status(200).json({
    success: true,
    data: notes,
  });
});
 