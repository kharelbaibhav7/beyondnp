import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
      maxLength: [50, "Collection name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, "Description cannot exceed 200 characters"],
      default: "",
    },
    color: {
      type: String,
      default: "#4800FF", // Default color matching your theme
    },
    icon: {
      type: String,
      default: "folder", // Default Lucide icon name
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    notesCount: {
      type: Number,
      default: 0,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
CollectionSchema.index({ user: 1, name: 1 });

export default mongoose.model("Collection", CollectionSchema);