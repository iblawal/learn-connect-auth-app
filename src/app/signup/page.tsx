"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth.service";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Eye, EyeOff } from "lucide-react";
import "../styles/auth-bg.css";


export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: phoneNumber,
      });

      if (response) {
        window.location.href = `/email-verification?email=${encodeURIComponent(formData.email)}`;
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg px-4 py-12">

      {}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow-400/30 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/40 rounded-full blur-[160px]"></div>

      {}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 text-center md:text-left px-8 md:px-16 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Join <span className="text-brandGold">Learn & Connect</span>
        </h1>
        <p className="text-white/80 text-lg max-w-md mb-6">
          Connect with global learners, boost your career, and unlock new
          opportunities through personalized growth and mentorship.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-sm font-medium text-yellow-300 border border-yellow-400/40 shadow-[0_0_25px_rgba(251,191,36,0.3)]"
        >
          Trusted by 10,000+ learners worldwide 🌍
        </motion.div>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_0_30px_rgba(251,191,36,0.3)] rounded-2xl p-8 mx-6 my-10 md:my-0 z-10"
      >
        <h2 className="text-3xl font-bold text-center text-brandGold mb-2">
          Create Account
        </h2>
        <p className="text-center text-white/70 mb-6 text-sm">
          Start your journey with Learn & Connect today
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-white text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {}
          <div>
            <label className="block text-sm font-semibold text-brandGold mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-white/90 text-gray-900 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-semibold text-brandGold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-white/90 text-gray-900 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-semibold text-brandGold mb-1">
              Phone Number
            </label>
            <PhoneInput
              defaultCountry="ng"
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
              placeholder="Enter phone number"
              className="intl-phone-custom"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-semibold text-brandGold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white/90 text-gray-900 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {}
          <div>
            <label className="block text-sm font-semibold text-brandGold mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white/90 text-gray-900 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-brandGold text-blue-900 font-semibold py-3 rounded-lg mt-4 hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(251,191,36,0.4)]"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

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

      {}
      <style jsx global>{`
        .intl-phone-custom .react-international-phone-input-container {
          width: 100%;
        }
        .intl-phone-custom .react-international-phone-input {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.9);
          color: #1f2937;
          border: 1px solid rgba(251, 191, 36, 0.4);
        }
      `}</style>
    </div>
  );
}
