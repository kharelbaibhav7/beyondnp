import express from "express";
import { protect } from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationCode,
  getUserProfile,
  updateUserProfile,
  changePassword,
  addToShortlist,
  removeFromShortlist,
  getShortlistedUniversities,
  getUserCollections,
  getUserNotes,
  getUserDocuments,
  getDashboardData,
  deleteUserAccount,
} from "../controller/userController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);

// Protected routes - all require authentication
router.use(protect);

// Profile routes
router
  .route("/profile")
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserAccount);

// Password routes
router.put("/change-password", changePassword);

// Dashboard route
router.get("/dashboard", getDashboardData);

// University shortlist routes
router.route("/shortlist").get(getShortlistedUniversities);

router
  .route("/shortlist/:universityId")
  .post(addToShortlist)
  .delete(removeFromShortlist);

// User's data routes
router.get("/collections", getUserCollections);
router.get("/notes", getUserNotes);
router.get("/documents", getUserDocuments);

export default router;
