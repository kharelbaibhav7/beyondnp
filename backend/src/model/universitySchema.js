import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
      maxLength: [100, "University name cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "University location is required"],
      trim: true,
      maxLength: [100, "Location cannot exceed 100 characters"],
    },
    link: {
      type: String,
      required: [true, "University link is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Please provide a valid URL",
      },
    },
    state: {
      type: String,
      trim: true,
      maxLength: [50, "State cannot exceed 50 characters"],
    },
    country: {
      type: String,
      default: "USA",
      trim: true,
    },
    ranking: {
      type: Number,
      min: 1,
    },
    acceptanceRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    tuitionFee: {
      type: Number,
      min: 0,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    programs: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
UniversitySchema.index({ name: 1 });
UniversitySchema.index({ location: 1 });
UniversitySchema.index({ state: 1 });

export default mongoose.model("University", UniversitySchema);
