import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import University from "../model/universitySchema.js";
import Collection from "../model/collectionSchema.js";
import Note from "../model/noteSchema.js";
import Document from "../model/documentSchema.js";
import {
  generateVerificationCode,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    emailVerificationCode: verificationCode,
    emailVerificationExpires: verificationExpires,
  });

  if (user) {
    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      verificationCode,
      name
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Don't fail registration if email fails, but log it
    }

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for verification code.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        requiresVerification: true,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.comparePassword(password))) {
    // Check if email is verified
    if (!user.isEmailVerified) {
      // Generate new verification code and send email
      const verificationCode = generateVerificationCode();
      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send verification email
      const emailResult = await sendVerificationEmail(
        email,
        verificationCode,
        user.name
      );

      if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error);
      }

      res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in. A new verification code has been sent to your email.",
        requiresVerification: true,
        data: {
          email: user.email,
          name: user.name,
        },
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Verify email with code
// @route   POST /api/users/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    res.status(400);
    throw new Error("Email and verification code are required");
  }

  // Find user with verification code
  const user = await User.findOne({
    email,
    emailVerificationCode: verificationCode,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification code");
  }

  // Update user as verified
  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  // Send welcome email
  const emailResult = await sendWelcomeEmail(email, user.name);
  if (!emailResult.success) {
    console.error("Failed to send welcome email:", emailResult.error);
  }

  res.status(200).json({
    success: true,
    message: "Email verified successfully! Welcome to Beyond NP!",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      token: generateToken(user._id),
    },
  });
});

// @desc    Resend verification code
// @route   POST /api/users/resend-verification
// @access  Public
export const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  // Generate new verification code
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Update user with new code
  user.emailVerificationCode = verificationCode;
  user.emailVerificationExpires = verificationExpires;
  await user.save();

  // Send verification email
  const emailResult = await sendVerificationEmail(
    email,
    verificationCode,
    user.name
  );

  if (!emailResult.success) {
    res.status(500);
    throw new Error("Failed to send verification email. Please try again.");
  }

  res.status(200).json({
    success: true,
    message: "Verification code sent successfully. Please check your email.",
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("shortlistedUniversities", "name location link state ranking")
    .populate("collections", "name description color icon notesCount")
    .populate("notes", "title content tags color isPinned")
    .populate("documents", "title status category priority dueDate");

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update basic fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Update profile fields
    if (req.body.profile) {
      user.profile = { ...user.profile, ...req.body.profile };
    }

    // Update preferences
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile,
        preferences: updatedUser.preferences,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// @desc    Add university to shortlist
// @route   POST /api/users/shortlist/:universityId
// @access  Private
export const addToShortlist = asyncHandler(async (req, res) => {
  const { universityId } = req.params;

  // Check if university exists
  const university = await University.findById(universityId);
  if (!university) {
    res.status(404);
    throw new Error("University not found");
  }

  // Check if already in shortlist
  const user = await User.findById(req.user._id);
  if (user.shortlistedUniversities.includes(universityId)) {
    res.status(400);
    throw new Error("University already in shortlist");
  }

  // Add to shortlist
  user.shortlistedUniversities.push(universityId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "University added to shortlist",
    data: university,
  });
});

// @desc    Remove university from shortlist
// @route   DELETE /api/users/shortlist/:universityId
// @access  Private
export const removeFromShortlist = asyncHandler(async (req, res) => {
  const { universityId } = req.params;

  const user = await User.findById(req.user._id);
  user.shortlistedUniversities = user.shortlistedUniversities.filter(
    (id) => id.toString() !== universityId
  );
  await user.save();

  res.status(200).json({
    success: true,
    message: "University removed from shortlist",
  });
});

// @desc    Get user's shortlisted universities
// @route   GET /api/users/shortlist
// @access  Private
export const getShortlistedUniversities = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "shortlistedUniversities",
    "name location link state ranking acceptanceRate tuitionFee programs"
  );

  res.status(200).json({
    success: true,
    data: user.shortlistedUniversities,
  });
});

// @desc    Get user's collections
// @route   GET /api/users/collections
// @access  Private
export const getUserCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({
    user: req.user._id,
    isArchived: false,
  }).sort({ lastModified: -1 });

  res.status(200).json({
    success: true,
    data: collections,
  });
});

// @desc    Get user's notes
// @route   GET /api/users/notes
// @access  Private
export const getUserNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id,
    isArchived: false,
  })
    .populate("parentCollection", "name color icon")
    .sort({ isPinned: -1, lastModified: -1 });

  res.status(200).json({
    success: true,
    data: notes,
  });
});

// @desc    Get user's documents
// @route   GET /api/users/documents
// @access  Private
export const getUserDocuments = asyncHandler(async (req, res) => {
  const { status, category } = req.query;

  let query = { user: req.user._id, isArchived: false };

  if (status) {
    query.status = status;
  }

  if (category) {
    query.category = category;
  }

  const documents = await Document.find(query).sort({
    dueDate: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: documents,
  });
});

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get counts
  const [
    shortlistedCount,
    collectionsCount,
    notesCount,
    documentsCount,
    pendingDocumentsCount,
    completedDocumentsCount,
  ] = await Promise.all([
    User.findById(userId).then((user) => user.shortlistedUniversities.length),
    Collection.countDocuments({ user: userId, isArchived: false }),
    Note.countDocuments({ user: userId, isArchived: false }),
    Document.countDocuments({ user: userId, isArchived: false }),
    Document.countDocuments({
      user: userId,
      status: "pending",
      isArchived: false,
    }),
    Document.countDocuments({
      user: userId,
      status: "completed",
      isArchived: false,
    }),
  ]);

  // Get recent activity
  const [recentNotes, recentDocuments, recentCollections] = await Promise.all([
    Note.find({ user: userId, isArchived: false })
      .populate("parentCollection", "name color")
      .sort({ lastModified: -1 })
      .limit(5),
    Document.find({ user: userId, isArchived: false })
      .sort({ lastModified: -1 })
      .limit(5),
    Collection.find({ user: userId, isArchived: false })
      .sort({ lastModified: -1 })
      .limit(5),
  ]);

  res.status(200).json({
    success: true,
    data: {
      counts: {
        shortlistedUniversities: shortlistedCount,
        collections: collectionsCount,
        notes: notesCount,
        documents: documentsCount,
        pendingDocuments: pendingDocumentsCount,
        completedDocuments: completedDocumentsCount,
      },
      recentActivity: {
        notes: recentNotes,
        documents: recentDocuments,
        collections: recentCollections,
      },
    },
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Delete all user's data
  await Promise.all([
    Collection.deleteMany({ user: userId }),
    Note.deleteMany({ user: userId }),
    Document.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
