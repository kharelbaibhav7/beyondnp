import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    status: {
      type: String,
      required: [true, "Document status is required"],
      enum: {
        values: ["pending", "in_progress", "completed", "submitted"],
        message:
          "Status must be one of: pending, in_progress, completed, submitted",
      },
      default: "pending",
    },
    description: {
      type: String,
      trim: true,
      maxLength: [300, "Description cannot exceed 300 characters"],
      default: "",
    },
    category: {
      type: String,
      trim: true,
      maxLength: [50, "Category cannot exceed 50 characters"],
      default: "general",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "Priority must be one of: low, medium, high, urgent",
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    attachments: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          required: true,
          trim: true,
        },
        size: {
          type: Number,
          min: 0,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxLength: [500, "Notes cannot exceed 500 characters"],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
DocumentSchema.index({ user: 1, status: 1 });
DocumentSchema.index({ user: 1, category: 1 });
DocumentSchema.index({ user: 1, dueDate: 1 });

// Pre-save middleware to set completedDate when status is completed
DocumentSchema.pre("save", function (next) {
  if (this.status === "completed" && !this.completedDate) {
    this.completedDate = new Date();
  } else if (this.status !== "completed" && this.completedDate) {
    this.completedDate = undefined;
  }
  next();
});

export default mongoose.model("Document", DocumentSchema);
