"use client";
import React, { useEffect, useState, useRef } from "react";
import { BookOpen, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  Camera,
  Image as ImageIcon,
  Upload,
  Settings,
  Search,
} from "lucide-react";


type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  
  const [user, setUser] = useState({
    fullName: "Ibrahim Lawal",
    email: "ibrahim@example.com",
    avatar: "", 
    profileCompleted: false,
  });

  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("lc:theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.remove("lc-light");
      root.classList.add("lc-dark");
    } else {
      root.classList.remove("lc-dark");
      root.classList.add("lc-light");
    }
    localStorage.setItem("lc:theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleCollapsed = () => setCollapsed((c) => !c);

  const handleFileSelect = (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
    
      setUser((u) => ({ ...u, avatar: String(reader.result) }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new (window as any).ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      track.stop();
      handleFileSelect(new File([blob], "camera.jpg", { type: blob.type }));
    } catch (err) {
      console.warn("Camera capture failed (browser may block); falling back to file picker.", err);
      openFilePicker();
    }
  };

  const handleLibrarySelect = () => {
    openFilePicker();
  };

  const initials = (name = "User") => {
    const parts = name.split(" ");
    const first = parts[0]?.[0] ?? "U";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
  };

  return (
    <div className="min-h-screen flex bg-[linear-gradient(180deg,#0f172a,rgba(8,9,20,0.6))] text-white">
      {}
      <aside
        className={`shrink-0 transition-all duration-300 ease-in-out flex flex-col z-20
          ${collapsed ? "w-20" : "w-64"} bg-[#1b3995] border-r border-black/20`}
      >
        {}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className={`relative ${collapsed ? "w-10 h-10" : "w-14 h-14"}`}> 
              {user.avatar ? (
                // next/image could be used, but keep simple img to accept data URLs too
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-white/20 shadow-sm"
                />
              ) : (
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center bg-white/10 text-xl font-semibold text-white`}
                >
                  {initials(user.fullName)}
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{user.fullName}</div>
                    <div className="text-xs text-white/80">{user.email}</div>
                  </div>

                  {}
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen((s) => !s)}
                      className="ml-3 p-2 rounded-md bg-white/6 hover:bg-white/10 transition"
                      aria-expanded={profileMenuOpen}
                      aria-label="Profile options"
                    >
                      <User className="w-4 h-4" />
                    </button>

                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute right-0 mt-2 w-56 bg-white/6 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-2"
                      >
                        <button
                          onClick={openFilePicker}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" /> Upload from file
                        </button>
                        <button
                          onClick={handleCameraCapture}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4" /> Take photo (camera)
                        </button>
                        <button
                          onClick={handleLibrarySelect}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2"
                        >
                          <ImageIcon className="w-4 h-4" /> Choose from library
                        </button>
                        <div className="border-t border-white/6 mt-2 pt-2">
                          <button
                            onClick={() => {
                              alert("Open profile settings (implement)");
                            }}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2"
                          >
                            <Settings className="w-4 h-4" /> Profile Settings
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {}
                <div className="mt-3">
                  <a
                    href="/profile/edit"
                    className="inline-block px-3 py-1 rounded-md text-xs bg-white/6 hover:bg-white/8"
                  >
                    Complete profile
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          className="hidden"
        />

        {}
        <nav className="flex-1 px-2 mt-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/6 transition text-sm"
              >
                <Menu className="w-5 h-5" />
                {!collapsed && <span>Dashboard</span>}
              </a>
            </li>

            <li>
              <a
                href="#directory"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/6 transition text-sm"
              >
                <Search className="w-5 h-5" />
                {!collapsed && <span>Directory</span>}
              </a>
            </li>

            <li>
              <a
                href="#courses"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/6 transition text-sm"
              >
                <BookOpen className="w-5 h-5" />
                {!collapsed && <span>Courses</span>}
              </a>
            </li>

            <li>
              <a
                href="#settings"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/6 transition text-sm"
              >
                <Settings className="w-5 h-5" />
                {!collapsed && <span>Settings</span>}
              </a>
            </li>
          </ul>
        </nav>

        {}
        <div className="px-4 py-4 border-t border-white/6">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                
                alert("Logout clicked — hook to your auth.logout()");
              }}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-white/6 w-full justify-center"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center">
            <button
              onClick={toggleCollapsed}
              className="p-2 rounded-md bg-white/6 hover:bg-white/8"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {}
      <div className="flex-1 flex flex-col">
        {}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 bg-transparent">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-2 rounded-md bg-white/6 hover:bg-white/8"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div className="hidden md:block text-sm text-white/80">Dashboard</div>
          </div>

          <div className="flex items-center gap-4">
            {}
            <div className="hidden sm:flex items-center bg-white/6 rounded-full px-3 py-1 gap-2">
              <Search className="w-4 h-4" />
              <input
                className="bg-transparent outline-none text-sm placeholder:text-white/60"
                placeholder="Search"
              />
            </div>

            {}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="p-2 rounded-md bg-white/6 hover:bg-white/8"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
            </button>

            {}
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm">{initials(user.fullName)}</div>
              <div className="text-sm text-white/90">{user.fullName.split(" ")[0]}</div>
            </div>
          </div>
        </div>

        {}
        <main className="p-6"> 
          {}
          <div className="max-w-7xl mx-auto space-y-8">
            {}
            <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#16a085]">Welcome back, {user.fullName.split(" ")[0]}</h1>
                <p className="text-sm text-white/80 mt-1">Explore your Learn & Connect dashboard</p>
              </div>

              <div className="flex items-center gap-4">
                <button className="px-4 py-2 rounded-md bg-[#16a085] hover:bg-[#129073] text-white">Create Post</button>
                <button className="px-4 py-2 rounded-md bg-white/6 hover:bg-white/8">Notifications</button>
              </div>
            </section>

            {}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Total Students", value: 1200, color: "#16a085", icon: Users },
                { label: "Same University", value: 48, color: "#60a5fa", icon: BookOpen },
                { label: "Same Course", value: 32, color: "#9ae6b4", icon: TrendingUp },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/6 rounded-2xl p-5 flex items-center justify-between border border-white/6"
                >
                  <div>
                    <p className="text-sm text-white/80 uppercase tracking-wide">{c.label}</p>
                    <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
                  </div>
                  <div className="p-3 bg-white/8 rounded-lg">
                    <c.icon className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              ))}
            </section>

            {}
            <section>
              <div className="bg-white/6 p-6 rounded-2xl border border-white/6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Student Directory</h2>
                  <div className="flex items-center gap-2">
                    <input className="px-3 py-2 rounded-md bg-transparent border border-white/6 placeholder:text-white/60 outline-none text-sm" placeholder="Search students..." />
                    <button className="px-3 py-2 rounded-md bg-white/8">Search</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {}
                  {[1,2,3,4,5,6].map((n) => (
                    <div key={n} className="bg-transparent p-4 rounded-lg border border-white/6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">AB</div>
                        <div>
                          <div className="font-semibold">Student {n}</div>
                          <div className="text-sm text-white/80">University · Course</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/6 p-6 rounded-2xl border border-white/6">
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <div className="flex gap-3 mt-3">
                    <button className="px-4 py-2 bg-[#16a085] rounded-md">Connect</button>
                    <button className="px-4 py-2 bg-white/8 rounded-md">Message</button>
                  </div>
                </div>

                <div className="bg-white/6 p-6 rounded-2xl border border-white/6">
                  <h3 className="font-semibold mb-2">Recommended Courses</h3>
                  <ul className="mt-3 space-y-2 text-white/80">
                    <li>• Frontend Mastery — 8 weeks</li>
                    <li>• Interview Prep Bootcamp — 4 weeks</li>
                    <li>• Presentation Lab — 3 weeks</li>
                  </ul>
                </div>
              </div>
            </section>

            {}
            {children}

          </div>
        </main>
      </div>
    </div>
  );
}
