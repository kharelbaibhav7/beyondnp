import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      // required: [true, "Note content is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxLength: [20, "Tag cannot exceed 20 characters"],
      },
    ],
    color: {
      type: String,
      default: "#4800FF", // Default color matching your theme
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
NoteSchema.index({ user: 1, parentCollection: 1 });
NoteSchema.index({ user: 1, tags: 1 });

// Pre-save middleware to update collection's lastModified and notesCount
NoteSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const Collection = mongoose.model("Collection");
      await Collection.findByIdAndUpdate(this.parentCollection, {
        $inc: { notesCount: 1 },
        lastModified: new Date(),
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Note", NoteSchema);
