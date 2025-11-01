"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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
      console.log(" Logging in...");
      await login(email, password);
      console.log(" Login successful!");
    } catch (err: any) {
      console.error(" Login failed:", err);
      
      // Better error handling
      if (err.response?.status === 403) {
        setError(" Please verify your email before logging in!");
      } else if (err.response?.status === 401) {
        setError(" Invalid email or password");
      } else if (err.message?.includes("verify")) {
        setError(" Please verify your email before logging in!");
      } else {
        setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-brandSky via-brandGold/10 to-brandEmerald/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
      >
        {/* Company Name */}
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center text-white font-bold text-2xl mb-6 tracking-wide"
        >
          Learn<span className="text-brandGold">&</span>Connect
        </motion.h2>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold text-center text-white mb-8"
        >
          Log In
        </motion.h1>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 text-white text-center p-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brandEmerald mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500 border border-brandEmerald/40 focus:outline-none focus:ring-2 focus:ring-brandGold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brandEmerald mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500 border border-brandEmerald/40 focus:outline-none focus:ring-2 focus:ring-brandGold"
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-brandGold hover:text-white transition"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-brandEmerald text-white font-semibold py-3 rounded-lg hover:bg-brandGold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-brandGold hover:text-white font-semibold transition"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}