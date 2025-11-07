import express from "express";
import {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);

router.post("/verify-email", verifyEmail);

router.post("/resend-code", resendVerificationCode);

router.post("/login", login);

export default router;