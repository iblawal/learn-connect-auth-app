"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {  
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-brandSky/80 backdrop-blur-md px-6 py-4 shadow-md sticky top-0 z-50">
      <h1 className="text-lg font-semibold">Learn & Connect</h1>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-sm">
              Welcome, <strong>{user?.fullName}</strong>
            </span>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-brandEmerald rounded-lg hover:bg-brandGold transition"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 bg-brandGold rounded-lg hover:bg-brandEmerald transition"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-brandEmerald rounded-lg hover:bg-brandGold transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}