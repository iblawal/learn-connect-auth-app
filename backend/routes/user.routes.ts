import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getProfile as getCurrentUser,
  updateProfile as updateCurrentUser,
  listUsers,
} from "../controllers/profile.controller";

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    List users for the student directory (search by name/email/school/course)
 * @access  Private
 */
router.get("/", protect, listUsers);

/**
 * @route   GET /api/users/me
 * @desc    Get the logged-in user's profile
 * @access  Private
 */
router.get("/me", protect, getCurrentUser);

/**
 * @route   PUT /api/users/me
 * @desc    Update the logged-in user's profile
 * @access  Private
 */
router.put("/me", protect, updateCurrentUser);

export default router;