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
import { useAuth } from "@/context/AuthContext"; 

type Props = {
  children?: React.ReactNode;
};

type AppUser = {
  id?: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  profileCompleted?: boolean;
  school?: string | null;
  course?: string | null;
};

export default function DashboardLayout({ children }: Props) {
  const { user: authUserFromCtx, token, logout } = useAuth() as {
    user?: { id?: string };
    token?: string | undefined;
    logout: () => void;
  };

  
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [directoryUsers, setDirectoryUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    school: "",
    course: "",
    customCourse: "",
  });

  
  const courseOptions = [
    "Computer Science",
    "Software Engineering",
    "Electrical/Electronic Engineering",
    "Mechanical Engineering",
    "Business Administration",
    "Law",
    "Medicine",
    "Accounting",
  ];

  
  const initials = (name = "User") => {
    const parts = name.trim().split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "U";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
  };


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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://learn-connect-auth-app-backend.onrender.com";
   
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
      
        console.error("Failed to fetch current user", await res.text());
        return;
      }
      const data: AppUser = await res.json();
      setCurrentUser(data);
      setProfileForm({
        fullName: data.fullName ?? "",
        school: data.school ?? "",
        course: data.course ?? "",
        customCourse: "",
      });
    } catch (err) {
      console.error("Error fetching current user", err);
    }
  };


  const fetchDirectory = async (q = "") => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (q) params.set("search", q);
      const res = await fetch(`${API_BASE}/api/users?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        console.error("Failed to fetch users", await res.text());
        setDirectoryUsers([]);
        setLoadingUsers(false);
        return;
      }
      const data: AppUser[] = await res.json();
      setDirectoryUsers(data);
    } catch (err) {
      console.error("Error fetching directory users", err);
      setDirectoryUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
  if (!token) return;
  fetchCurrentUser();
  fetchDirectory("");
}, [authUserFromCtx?.id, token]);

  useEffect(() => {
    const id = setTimeout(() => {
      fetchDirectory(searchQuery);
    }, 350);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const handleFileSelect = async (file?: File | null) => {
    if (!file || !currentUser) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await fetch(`${API_BASE}/api/users/me/avatar`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Avatar upload failed", txt);
        alert("Avatar upload failed");
        setUploading(false);
        return;
      }
      const updated: AppUser = await res.json();
      setCurrentUser(updated);
    } catch (err) {
      console.error("Avatar upload error", err);
      alert("Avatar upload error");
    } finally {
      setUploading(false);
      setProfileMenuOpen(false);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const ImageCaptureCtor = (window as any).ImageCapture;
      if (!ImageCaptureCtor) {
        track.stop();
        openFilePicker();
        return;
      }
      const imageCapture = new ImageCaptureCtor(track);
      const blob = await imageCapture.takePhoto();
      track.stop();
      handleFileSelect(new File([blob], "camera.jpg", { type: blob.type }));
    } catch (err) {
      console.warn("Camera capture failed; falling back to file picker.", err);
      openFilePicker();
    }
  };

  const handleLibrarySelect = () => {
    openFilePicker();
  };

  const openEdit = () => {
    setProfileForm({
      fullName: currentUser?.fullName ?? "",
      school: currentUser?.school ?? "",
      course: currentUser?.course ?? "",
      customCourse: "",
    });
    setEditOpen(true);
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    setSavingProfile(true);
    try {
      const courseToSave = profileForm.customCourse?.trim()
        ? profileForm.customCourse.trim()
        : profileForm.course?.trim() ?? null;

      const payload = {
        fullName: profileForm.fullName.trim(),
        school: profileForm.school.trim(),
        course: courseToSave,
      };

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Failed to save profile", txt);
        alert("Failed to save profile");
        setSavingProfile(false);
        return;
      }

      const updated: AppUser = await res.json();
      setCurrentUser(updated);
      setEditOpen(false);
      fetchDirectory(searchQuery);
    } catch (err) {
      console.error("Error saving profile", err);
      alert("Error saving profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const totalStudents = directoryUsers.length;
  const sameUniversity = currentUser
    ? directoryUsers.filter((u) => u.school && currentUser.school && u.school === currentUser.school).length
    : 0;
  const sameCourse = currentUser
    ? directoryUsers.filter((u) => u.course && currentUser.course && u.course === currentUser.course).length
    : 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[linear-gradient(180deg,#0f172a,rgba(8,9,20,0.6))] text-white overflow-x-hidden">
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-20"
          onClick={() => setCollapsed(true)}
        ></div>
      )}

      {}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out flex flex-col
        ${collapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 md:w-64"} 
        bg-[#1b3995] border-r border-black/20`}
      >
        {}
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className={`relative ${collapsed ? "w-10 h-10" : "w-14 h-14"}`}>
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-white/20 shadow-sm"
                />
              ) : (
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center bg-white/10 text-xl font-semibold text-white`}
                >
                  {initials(currentUser?.fullName ?? "User")}
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{currentUser?.fullName ?? "User"}</div>
                    <div className="text-xs text-white/80">{currentUser?.email ?? "user@example.com"}</div>
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
                              setProfileMenuOpen(false);
                              openEdit();
                            }}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2"
                          >
                            <Settings className="w-4 h-4" /> Edit Profile
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {}
                {!currentUser?.profileCompleted && (
                  <div className="mt-3">
                    <a
                      href="/profile/edit"
                      className="inline-block px-3 py-1 rounded-md text-xs bg-white/6 hover:bg-white/8"
                    >
                      Complete profile
                    </a>
                  </div>
                )}
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
              onClick={handleLogout}
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
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/6 bg-transparent">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm">
                {initials(currentUser?.fullName ?? "User")}
              </div>
              <div className="text-sm text-white/90">{(currentUser?.fullName ?? "User").split(" ")[0]}</div>
            </div>
          </div>
        </div>

        {}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {}
            <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#0EA5E9]">
                  Welcome back, {(currentUser?.fullName ?? "User").split(" ")[0]}!
                </h1>
                <p className="text-sm text-white/80 mt-1">Explore your Learn & Connect dashboard</p>
              </div>

              <div className="flex items-center gap-4">
                <button className="px-4 py-2 rounded-md bg-[#0EA5E9] hover:bg-[#129073] text-white">Create Post</button>
                <button className="px-4 py-2 rounded-md bg-white/6 hover:bg-white/8">Notifications</button>
              </div>
            </section>

            {}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: "Total Students", value: totalStudents, color: "#16a085", icon: Users },
                { label: "Same University", value: sameUniversity, color: "#60a5fa", icon: BookOpen },
                { label: "Same Course", value: sameCourse, color: "#9ae6b4", icon: TrendingUp },
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
            <section id="directory">
              <div className="bg-white/6 p-6 rounded-2xl border border-white/6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Student Directory</h2>
                  <div className="flex items-center gap-2">
                    <input
                      className="px-3 py-2 rounded-md bg-transparent border border-white/6 placeholder:text-white/60 outline-none text-sm"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      className="px-3 py-2 rounded-md bg-white/8"
                      onClick={() => fetchDirectory(searchQuery)}
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loadingUsers ? (
                    <div className="col-span-full text-center py-8 text-white/70">Loading users...</div>
                  ) : directoryUsers.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-white/70">No users found.</div>
                  ) : (
                    directoryUsers.map((u) => (
                      <div key={u.id ?? u.email} className="bg-transparent p-4 rounded-lg border border-white/6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            {initials(u.fullName)}
                          </div>
                          <div>
                            <div className="font-semibold">{u.fullName}</div>
                            <div className="text-sm text-white/80">
                              {u.school ?? "—"} · {u.course ?? "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/6 p-6 rounded-2xl border border-white/6">
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <div className="flex gap-3 mt-3">
                    <button className="px-4 py-2 bg-[#0EA5E9] rounded-md">Connect</button>
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

      {}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#0b1220] rounded-2xl p-6 border border-white/6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button onClick={() => setEditOpen(false)} className="text-sm text-white/70">Close</button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm">Full name</label>
              <input
                className="w-full px-3 py-2 rounded-md bg-transparent border border-white/6 outline-none"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm((s) => ({ ...s, fullName: e.target.value }))}
              />

              <label className="block text-sm">School (type)</label>
              <input
                className="w-full px-3 py-2 rounded-md bg-transparent border border-white/6 outline-none"
                value={profileForm.school}
                onChange={(e) => setProfileForm((s) => ({ ...s, school: e.target.value }))}
                placeholder="Type your university"
              />

              <label className="block text-sm">Course (select or type)</label>
              <div className="flex gap-2">
                <select
                  value={profileForm.course}
                  onChange={(e) => setProfileForm((s) => ({ ...s, course: e.target.value, customCourse: "" }))}
                  className="flex-1 px-3 py-2 rounded-md bg-transparent border border-white/6 outline-none"
                >
                  <option value="">Select a course</option>
                  {courseOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__other">Other (type below)</option>
                </select>

                <input
                  className="flex-1 px-3 py-2 rounded-md bg-transparent border border-white/6 outline-none"
                  placeholder="Or type your course"
                  value={profileForm.customCourse}
                  onChange={(e) => {
                    setProfileForm((s) => ({ ...s, customCourse: e.target.value, course: "" }));
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 rounded-md bg-white/6 hover:bg-white/8"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="px-4 py-2 rounded-md bg-[#0EA5E9] hover:bg-[#129073] text-white"
                >
                  {savingProfile ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
