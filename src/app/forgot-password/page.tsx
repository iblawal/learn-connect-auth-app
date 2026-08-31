"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../styles/auth-portal.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);
    } catch (err: any) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="portal-shell">
        <div className="portal-brand">
          <span className="portal-brand-mark">
            <span className="portal-brand-dot" />
            Learn &amp; Connect
          </span>
          <span className="portal-brand-tagline">Password Reset</span>
        </div>

        <div className="portal-card text-center">
          <h1 className="text-lg font-bold text-[#0369a1] mb-3">
            Check your email
          </h1>
          <p className="text-sm text-[#0c2a3e] mb-1">
            We&apos;ve sent a password reset link to
          </p>
          <p className="text-sm font-semibold text-[#0369a1] mb-6">{email}</p>
          <p className="text-xs text-[#5b6472]">
            Redirecting you to the reset password page…
          </p>
        </div>

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

  return (
    <div className="portal-shell">
      <div className="portal-brand">
        <span className="portal-brand-mark">
          <span className="portal-brand-dot" />
          Learn &amp; Connect
        </span>
        <span className="portal-brand-tagline">Password Reset</span>
      </div>

      <div className="portal-card">
        {error && <div className="portal-error">{error}</div>}

        <p className="text-sm text-[#0c2a3e] mb-6">
          Enter your email and we&apos;ll send you instructions to reset your
          password.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="portal-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="portal-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="portal-button-outline portal-button-block"
          >
            {isLoading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
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