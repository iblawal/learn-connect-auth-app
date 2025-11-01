"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth.service";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!phoneNumber) {
        setError("Please enter your phone number");
        setIsLoading(false);
        return;
      }

      console.log("📤 Sending registration request...");

      // Call backend API
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: phoneNumber,
      });

      console.log(" Backend Response:", response);

      //  IMPROVED: Check multiple possible success indicators
      if (response.success || response.data || response.message?.toLowerCase().includes("success")) {
        console.log(" Registration successful! Redirecting...");
        
        // Always redirect to verification page
        router.push(`/email-verification?email=${encodeURIComponent(formData.email)}`);
      } else {
        // If backend returns error
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error(" Registration Error:", err);
      console.error("Error Response:", err.response?.data);
      
      //  IMPROVED: Better error messages
      if (err.response?.data) {
        setError(err.response.data.message || err.response.data.error || "Registration failed");
      } else if (err.response?.status === 409) {
        setError("Email already exists. Please login instead.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.message.includes("Network Error")) {
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        setError(err.message || "An error occurred during registration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-brandSky via-brandGold/10 to-brandEmerald/20 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-brandGold mb-2">
          Create Account 
        </h1>
        <p className="text-center text-white/80 mb-6 text-sm">
          Join Learn & Connect to meet coursemates worldwide
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-brandEmerald mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500 border border-brandEmerald/40 focus:outline-none focus:ring-2 focus:ring-brandGold"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-brandEmerald mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500 border border-brandEmerald/40 focus:outline-none focus:ring-2 focus:ring-brandGold"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-brandEmerald mb-1">
              Phone Number
            </label>
            <PhoneInput
              defaultCountry="ng"
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
              placeholder="Enter phone number"
              className="intl-phone-custom"
            />
            <p className="text-xs text-white/60 mt-1">
              Select your country and enter your phone number
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-brandEmerald mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2.5 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500 border border-brandEmerald/40 focus:outline-none focus:ring-2 focus:ring-brandGold"
            />
            <p className="text-xs text-white/60 mt-1">Minimum 6 characters</p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-brandEmerald text-white font-semibold py-3 rounded-lg mt-4 hover:bg-brandGold transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brandGold hover:text-white font-semibold transition"
          >
            Log In
          </Link>
        </p>
      </motion.div>

      {/* Phone Input Styles */}
      <style jsx global>{`
        .intl-phone-custom .react-international-phone-input-container {
          width: 100%;
        }

        .intl-phone-custom .react-international-phone-input {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.8);
          color: #1f2937;
          border: 1px solid rgba(16, 185, 129, 0.4);
          font-size: 0.875rem;
          outline: none;
        }

        .intl-phone-custom .react-international-phone-input:focus {
          border-color: #fbbf24;
          box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
        }

        .intl-phone-custom .react-international-phone-country-selector-button {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 0.5rem 0 0 0.5rem;
          padding: 0.625rem 0.5rem;
          border-right: none;
        }

        .intl-phone-custom .react-international-phone-country-selector-button:hover {
          background: rgba(255, 255, 255, 0.9);
        }

        .intl-phone-custom .react-international-phone-input::placeholder {
          color: rgba(107, 114, 128, 0.6);
        }
      `}</style>
    </div>
  );
}