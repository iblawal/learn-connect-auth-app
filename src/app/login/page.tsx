"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "../styles/auth-portal.css";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Login failed:", err);

      if (err.response?.status === 403) {
        setError("Please verify your email before logging in.");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.message?.includes("verify")) {
        setError("Please verify your email before logging in.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-shell">
      <div className="portal-brand">
        <span className="portal-brand-mark">
          <span className="portal-brand-dot" />
          Learn &amp; Connect
        </span>
        <span className="portal-brand-tagline">Online Learning Platform</span>
      </div>

      <div className="portal-card">
        {error && <div className="portal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
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

          <div>
            <label htmlFor="password" className="portal-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="portal-input"
            />
          </div>

          <div className="portal-row">
            <div className="portal-check-group">
              <label className="portal-checkbox-label">
                <input
                  type="checkbox"
                  checked={stayLoggedIn}
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                  className="portal-checkbox"
                />
                Stay signed in
              </label>
              <Link href="/forgot-password" className="portal-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="portal-button-outline"
            >
              {loading ? "Logging in…" : "Log In"}
            </button>
          </div>
        </form>
      </div>

      <p className="portal-secondary-text">
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
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