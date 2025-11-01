"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white fixed w-full top-0 z-50 shadow-md">
        <h1 className="text-2xl font-bold">Learn & Connect </h1>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 items-center">
          <li>
            <a href="#home" className="hover:text-yellow-300 transition">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-yellow-300 transition">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="hover:text-yellow-300 transition">
              Services
            </a>
          </li>
          <li>
            <Link
              href="/login"
              className="bg-yellow-400 px-6 py-2 rounded-lg text-black font-semibold hover:bg-yellow-500 transition"
            >
              Log In
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end md:hidden">
          <div className="bg-blue-600 w-64 h-full p-6 text-white flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={26} />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 mt-6">
              <a
                href="#home"
                className="hover:text-yellow-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="#about"
                className="hover:text-yellow-300 transition"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              <a
                href="#services"
                className="hover:text-yellow-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Services
              </a>
              <Link
                href="/login"
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
