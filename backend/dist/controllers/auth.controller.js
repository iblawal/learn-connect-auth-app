"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.resendVerificationCode = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const sendEmail_1 = require("../utils/sendEmail");
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        // Validation
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }
        // Generate verification code
        const verificationCode = (0, sendEmail_1.generateVerificationCode)();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Create user
        const user = await User_1.default.create({
            fullName,
            email,
            password,
            phone,
            isVerified: false,
            verificationCode,
            verificationCodeExpires,
        });
        // Get user ID as string
        const userId = String(user._id);
        // Send verification email
        const { text, html } = (0, sendEmail_1.verificationEmailTemplate)(fullName, verificationCode);
        await (0, sendEmail_1.sendEmail)({
            to: email,
            subject: "Verify Your Email - Dashboard App",
            text,
            html,
        });
        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email for verification code.",
            data: {
                userId,
                email: user.email,
                fullName: user.fullName,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message,
        });
    }
};
exports.register = register;
// @desc    Verify email with code
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        // Validation
        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and verification code",
            });
        }
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified",
            });
        }
        // Check verification code
        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code",
            });
        }
        // Check if code expired
        if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Verification code expired. Please request a new one.",
            });
        }
        // Verify user
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        // Get user ID as string
        const userId = String(user._id);
        // Generate token
        const token = (0, generateToken_1.generateToken)(userId, user.email);
        res.status(200).json({
            success: true,
            message: "Email verified successfully!",
            data: {
                token,
                user: {
                    id: userId,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    isVerified: user.isVerified,
                },
            },
        });
    }
    catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during verification",
            error: error.message,
        });
    }
};
exports.verifyEmail = verifyEmail;
// @desc    Resend verification code
// @route   POST /api/auth/resend-code
// @access  Public
const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email",
            });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified",
            });
        }
        // Generate new code
        const verificationCode = (0, sendEmail_1.generateVerificationCode)();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();
        // Send email
        const { text, html } = (0, sendEmail_1.verificationEmailTemplate)(user.fullName, verificationCode);
        await (0, sendEmail_1.sendEmail)({
            to: email,
            subject: "New Verification Code - Dashboard App",
            text,
            html,
        });
        res.status(200).json({
            success: true,
            message: "New verification code sent to your email",
        });
    }
    catch (error) {
        console.error("Resend code error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
exports.resendVerificationCode = resendVerificationCode;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
            });
        }
        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        // Get user ID as string
        const userId = String(user._id);
        // Generate token
        const token = (0, generateToken_1.generateToken)(userId, user.email);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: userId,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    isVerified: user.isVerified,
                },
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message,
        });
    }
};
exports.login = login;
