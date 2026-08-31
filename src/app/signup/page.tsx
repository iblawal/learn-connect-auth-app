"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authService } from "@/lib/service/auth.service";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Eye, EyeOff } from "lucide-react";
import "../styles/auth-portal.css";

export default function SignupPage() {
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
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!phoneNumber) {
      setError("Please enter your phone number.");
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
    <div className="portal-shell">
      <div className="portal-brand">
        <span className="portal-brand-mark">
          <span className="portal-brand-dot" />
          Learn &amp; Connect
        </span>
        <span className="portal-brand-tagline">Create Your Account</span>
      </div>

      <div className="portal-card">
        {error && <div className="portal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="portal-label">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="portal-input"
            />
          </div>

          <div>
            <label htmlFor="email" className="portal-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="portal-input"
            />
          </div>

          <div>
            <label htmlFor="phone" className="portal-label">
              Phone Number
            </label>
            <PhoneInput
              defaultCountry="ng"
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
              placeholder="Enter phone number"
              className="intl-phone-portal"
            />
          </div>

          <div>
            <label htmlFor="password" className="portal-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="portal-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0369a1]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="portal-label">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="portal-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0369a1]"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="portal-button-outline portal-button-block"
          >
            {isLoading ? "Creating account…" : "Create Account"}
          </button>
        </form>
      </div>

      <p className="portal-secondary-text">
        Already have an account? <Link href="/login">Log in</Link>
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