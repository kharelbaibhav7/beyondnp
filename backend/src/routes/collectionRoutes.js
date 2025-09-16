import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getCollections,
  getArchivedCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionById,
} from "../controller/collectionController.js";

const router = express.Router();

router.use(protect); // All routes require authentication

router.route("/").get(getCollections).post(createCollection);

router.get("/archived", getArchivedCollections);

router
  .route("/:id")
  .get(getCollectionById)
  .put(updateCollection)
  .delete(deleteCollection);

export default router;
