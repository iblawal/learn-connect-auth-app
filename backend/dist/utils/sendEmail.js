"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationEmailTemplate = exports.generateVerificationCode = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    try {
        // Create transporter
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        // Email options
        const mailOptions = {
            from: `"Dashboard App" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error("❌ Email sending failed:", error);
        throw new Error("Failed to send email");
    }
};
exports.sendEmail = sendEmail;
// Generate 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
// Email template for verification
const verificationEmailTemplate = (fullName, code) => {
    const text = `
    Hi ${fullName},
    
    Thank you for registering with Dashboard App!
    
    Your verification code is: ${code}
    
    This code will expire in 10 minutes.
    
    If you didn't create an account, please ignore this email.
    
    Best regards,
    Dashboard App Team
  `;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Dashboard App! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hi ${fullName},</h2>
          <p>Thank you for registering with Dashboard App! We're excited to have you on board.</p>
          <p>To complete your registration, please use the verification code below:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <p><strong>⏰ This code will expire in 10 minutes.</strong></p>
          <p>If you didn't create an account with us, please ignore this email.</p>
          
          <div class="footer">
            <p>Best regards,<br><strong>Dashboard App Team</strong></p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
    return { text, html };
};
exports.verificationEmailTemplate = verificationEmailTemplate;
