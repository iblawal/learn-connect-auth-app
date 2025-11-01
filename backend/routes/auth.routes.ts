import express from "express";
import {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
} from "../controllers/auth.controller";

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", register);

// @route   POST /api/auth/verify-email
router.post("/verify-email", verifyEmail);

// @route   POST /api/auth/resend-code
router.post("/resend-code", resendVerificationCode);

// @route   POST /api/auth/login
router.post("/login", login);

export default router;