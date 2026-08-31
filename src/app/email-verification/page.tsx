"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/service/auth.service";
import "../styles/auth-portal.css";

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
    <div className="portal-shell">
      <div className="portal-brand">
        <span className="portal-brand-mark">
          <span className="portal-brand-dot" />
          Learn &amp; Connect
        </span>
        <span className="portal-brand-tagline">Verify Your Email</span>
      </div>

      <div className="portal-card">
        <p className="text-sm text-[#0c2a3e] text-center mb-1">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-semibold text-[#0369a1] text-center mb-6">
          {email}
        </p>

        {success && (
          <div className="mb-5 p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded text-[#065f46] text-sm">
            {success}
          </div>
        )}

        {error && <div className="portal-error">{error}</div>}

        <form onSubmit={handleVerify}>
          <div>
            <label htmlFor="code" className="portal-label text-center">
              Enter Verification Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              className="portal-input text-center text-2xl font-bold tracking-[0.4em]"
            />
            <p className="text-xs text-[#5b6472] mt-2 text-center">
              Code expires in 10 minutes
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="portal-button-outline portal-button-block"
          >
            {isLoading ? "Verifying…" : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#5b6472] mb-1">
            Didn&apos;t receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="portal-link bg-transparent disabled:opacity-50"
          >
            {isResending ? "Sending…" : "Resend Code"}
          </button>
        </div>
      </div>

      <p className="portal-secondary-text">
        <Link href="/login">← Back to login</Link>
      </p>

      <div className="portal-footer">
        <div className="portal-footer-links">
          <a href="/help">Help</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
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