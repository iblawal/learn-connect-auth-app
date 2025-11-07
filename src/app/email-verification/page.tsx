"use client";
import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/service/auth.service";
import "../styles/auth-bg.css";

function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (code.length !== 6) {
        setError("Please enter a 6-digit code");
        setIsLoading(false);
        return;
      }

      const response = await authService.verifyEmail({ email, code });

      if (response.success) {
        setSuccess("Email verified successfully! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(response.message || "Verification failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      const response = await authService.resendCode(email);
      if (response.success) {
        setSuccess("New code sent! Check your email.");
      } else {
        setError(response.message || "Failed to resend code");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to resend code"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-br from-brandSky via-brandGold/10 to-brandEmerald/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-brandGold mb-2">
            Verify Your Email
          </h1>
          <p className="text-white/80 text-sm">We sent a 6-digit code to</p>
          <p className="text-brandGold font-semibold mt-1">{email}</p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-white text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brandEmerald mb-2 text-center">
              Enter Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 text-center text-2xl font-bold tracking-widest placeholder-gray-400 border border-brandEmerald/40 focus:outline-none focus:ring-2 focus:ring-brandGold"
            />
            <p className="text-xs text-white/60 mt-2 text-center">
              Code expires in 10 minutes
            </p>
          </div>

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full bg-brandEmerald text-white font-semibold py-3 rounded-lg hover:bg-brandGold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                    5.291A7.962 7.962 0 014 12H0c0 3.042 
                    1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/70 mb-2">
            Didn&apos;t receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="text-brandGold hover:text-white font-semibold transition disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-white/70 hover:text-brandGold transition"
          >
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}


export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <EmailVerificationContent />
    </Suspense>
  );
}
