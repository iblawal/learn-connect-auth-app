"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-shadow duration-200 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-xl font-bold tracking-tight text-[#0c2a3e]">
              Learn<span className="text-sky-500">&amp;</span>Connect
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-sky-600 transition"
                >
                  {link.label}
                </a>
              </li>
            ))}

            {isAuthenticated ? (
              <>
                <li>
                  <span className="text-sm text-gray-600">
                    Hi, <strong className="text-[#0c2a3e]">{user?.fullName}</strong>
                  </span>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold bg-sky-600 text-white px-5 py-2 rounded hover:bg-sky-700 transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="text-sm font-semibold border-[1.5px] border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="text-sm font-semibold border-[1.5px] border-sky-600 text-sky-700 px-5 py-2 rounded hover:bg-sky-600 hover:text-white transition"
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="text-sm font-semibold bg-sky-600 text-white px-5 py-2 rounded hover:bg-sky-700 transition"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-[#0c2a3e] focus:outline-none"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Spacer so page content isn't hidden behind the fixed navbar */}
      <div className="h-[64px]" />

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end md:hidden">
          <div className="bg-white w-72 h-full p-6 flex flex-col shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <span className="text-base font-bold text-[#0c2a3e]">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="text-gray-500 hover:text-[#0c2a3e]"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-sky-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600 mt-2">
                    Signed in as <strong className="text-[#0c2a3e]">{user?.fullName}</strong>
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold bg-sky-600 text-white px-5 py-2.5 rounded hover:bg-sky-700 transition text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="text-sm font-semibold border-[1.5px] border-red-500 text-red-600 px-5 py-2.5 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold border-[1.5px] border-sky-600 text-sky-700 px-5 py-2.5 rounded hover:bg-sky-600 hover:text-white transition text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-semibold bg-sky-600 text-white px-5 py-2.5 rounded hover:bg-sky-700 transition text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}