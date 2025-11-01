"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
// @route   POST /api/auth/register
router.post("/register", auth_controller_1.register);
// @route   POST /api/auth/verify-email
router.post("/verify-email", auth_controller_1.verifyEmail);
// @route   POST /api/auth/resend-code
router.post("/resend-code", auth_controller_1.resendVerificationCode);
// @route   POST /api/auth/login
router.post("/login", auth_controller_1.login);
exports.default = router;
