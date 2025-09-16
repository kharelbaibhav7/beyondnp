import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getNotes,
  getArchivedNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
  searchNotes,
} from "../controller/noteController.js";

const router = express.Router();

router.use(protect); // All routes require authentication

router.route("/").get(getNotes).post(createNote);

router.get("/archived", getArchivedNotes);
router.get("/search", searchNotes);

router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);

export default router;
