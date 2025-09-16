import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
      minLength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    shortlistedUniversities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University",
      },
    ],
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
      },
    ],
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    profile: {
      avatar: {
        type: String,
        trim: true,
      },
      bio: {
        type: String,
        trim: true,
        maxLength: [200, "Bio cannot exceed 200 characters"],
      },
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
          },
          message: "Please provide a valid phone number",
        },
      },
      dateOfBirth: {
        type: Date,
      },
      nationality: {
        type: String,
        default: "Nepalese",
        trim: true,
      },
      currentEducation: {
        level: {
          type: String,
          enum: ["high_school", "bachelor", "master", "phd"],
        },
        institution: {
          type: String,
          trim: true,
        },
        graduationYear: {
          type: Number,
        },
      },
      targetIntake: {
        type: String,
        trim: true,
      },
      targetMajor: {
        type: String,
        trim: true,
      },
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "auto",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        documentReminders: {
          type: Boolean,
          default: true,
        },
        universityUpdates: {
          type: Boolean,
          default: true,
        },
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
UserSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile (without sensitive data)
UserSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// Virtual for full name
UserSchema.virtual("fullName").get(function () {
  return this.name;
});

// Ensure virtual fields are serialized
UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

export default mongoose.model("User", UserSchema);
