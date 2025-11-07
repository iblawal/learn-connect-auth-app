"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "../styles/auth-bg.css";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError("Please verify your email before logging in!");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.message?.includes("verify")) {
        setError("Please verify your email before logging in!");
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
    <div className="min-h-screen flex items-center justify-center animated-bg px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 relative z-10"
      >
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
            Learn<span className="text-brandGold">&</span>Connect
          </h2>
          <p className="text-white/70 text-sm">
            Welcome back! Log in to continue your learning journey.
          </p>
        </motion.div>

        {}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-400/50 text-white text-center p-3 rounded-lg mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        {}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-brandEmerald mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 border border-brandEmerald/30 focus:outline-none focus:ring-2 focus:ring-brandGold"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-brandEmerald mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 border border-brandEmerald/30 focus:outline-none focus:ring-2 focus:ring-brandGold"
            />
          </motion.div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-brandGold hover:text-white transition"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-brandEmerald text-white font-semibold py-3 rounded-lg hover:bg-brandGold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
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
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-white/80 mt-8"
        >
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-brandGold hover:text-white font-semibold transition"
          >
            Sign Up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
