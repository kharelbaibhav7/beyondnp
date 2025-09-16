import asyncHandler from "express-async-handler";
import Collection from "../model/collectionSchema.js";
import Note from "../model/noteSchema.js";

// @desc    Get all collections for a user
// @route   GET /api/collections
// @access  Private
export const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({
    user: req.user._id,
    isArchived: false,
  }).sort({ lastModified: -1 });

  res.status(200).json({
    success: true,
    data: collections,
  });
});

// @desc    Get archived collections
// @route   GET /api/collections/archived
// @access  Private
export const getArchivedCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({
    user: req.user._id,
    isArchived: true,
  }).sort({ lastModified: -1 });

  res.status(200).json({
    success: true,
    data: collections,
  });
});

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private
export const createCollection = asyncHandler(async (req, res) => {
  const { name, description, color, icon } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Collection name is required");
  }

  // Check if collection with same name exists
  const existingCollection = await Collection.findOne({
    user: req.user._id,
    name: name,
  });

  if (existingCollection) {
    res.status(400);
    throw new Error("Collection with this name already exists");
  }

  const collection = await Collection.create({
    user: req.user._id,
    name,
    description,
    color,
    icon,
  });

  res.status(201).json({
    success: true,
    data: collection,
  });
});

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
export const updateCollection = asyncHandler(async (req, res) => {
  const { name, description, color, icon, isArchived } = req.body;

  const collection = await Collection.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  // Check if new name conflicts with existing collection
  if (name && name !== collection.name) {
    const existingCollection = await Collection.findOne({
      user: req.user._id,
      name: name,
      _id: { $ne: collection._id },
    });

    if (existingCollection) {
      res.status(400);
      throw new Error("Collection with this name already exists");
    }
  }

  collection.name = name || collection.name;
  collection.description = description || collection.description;
  collection.color = color || collection.color;
  collection.icon = icon || collection.icon;
  collection.isArchived = isArchived ?? collection.isArchived;
  collection.lastModified = new Date();

  await collection.save();

  res.status(200).json({
    success: true,
    data: collection,
  });
});

// @desc    Delete collection and all its notes
// @route   DELETE /api/collections/:id
// @access  Private
export const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  // Delete all notes in the collection
  await Note.deleteMany({
    collection: collection._id,
  });

  // Delete the collection
  await Collection.deleteOne({ _id: collection._id });

  res.status(200).json({
    success: true,
    message: "Collection and all its notes deleted successfully",
  });
});

// @desc    Get collection by ID with its notes
// @route   GET /api/collections/:id
// @access  Private
export const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  const notes = await Note.find({
    collection: collection._id,
    isArchived: false,
  }).sort({ isPinned: -1, lastModified: -1 });

  res.status(200).json({
    success: true,
    data: {
      collection,
      notes,
    },
  });
});
