"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, LogOut, Search, BookOpen, Users, TrendingUp, Edit } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { profileService } from "@/lib/service/profileService";
import type { User as APIUser, DashboardStats as APIDashboardStats } from "@/lib/service/profileService";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user: authUser, logout } = useAuth();
  const [stats, setStats] = useState<APIDashboardStats | null>(null);
  const [students, setStudents] = useState<APIUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Try to fetch dashboard stats
      try {
        const statsResponse = await profileService.getDashboardStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (statsErr: any) {
        console.warn(" Could not load stats:", statsErr.message);
        // Don't show error, just use default values
      }

      // Try to fetch students
      try {
        const studentsResponse = await profileService.getAllUsers();
        if (studentsResponse.success) {
          setStudents(studentsResponse.data);
        }
      } catch (studentsErr: any) {
        console.warn(" Could not load students:", studentsErr.message);
      }
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError("Some features may not be available right now");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const filteredStudents = students.filter((student) =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-brandSky via-brandEmerald/10 to-brandGold/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brandGold mx-auto"></div>
          <p className="mt-4 text-brandEmerald text-xl font-semibold">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Use authUser as fallback if stats not loaded
  const displayUser = stats?.user || authUser;
  const displayStats = stats?.stats || { totalUsers: 0, sameUniversity: 0, sameCourse: 0 };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-brandSky via-brandEmerald/10 to-brandGold/10 text-white">
        {/* Sidebar */}
        <aside className="lg:w-64 w-full bg-brandEmerald/30 backdrop-blur-md border-r border-brandEmerald/40 p-6 space-y-8 flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-start">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-brandGold" />
            <h2 className="text-2xl font-bold text-brandGold">Learn & Connect</h2>
          </div>

          <nav className="flex flex-row lg:flex-col gap-6">
            <a href="#profile" className="hover:text-brandGold transition flex items-center gap-2">
              <User className="w-5 h-5" /> Profile
            </a>
            <a href="#stats" className="hover:text-brandGold transition flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Stats
            </a>
            <a href="#directory" className="hover:text-brandGold transition flex items-center gap-2">
              <Users className="w-5 h-5" /> Directory
            </a>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-12 overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 text-white px-4 py-3 rounded-lg backdrop-blur-md">
               {error}
            </div>
          )}

          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-4xl font-bold text-brandGold">
                Welcome back, {displayUser?.fullName?.split(" ")[0] || "User"} 
              </h1>
              <p className="text-brandSky/90 mt-2 text-lg">
                Explore your Learn & Connect dashboard
              </p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${displayUser?.fullName || "User"}&background=0D9488&color=fff&bold=true`}
              alt="User avatar"
              className="w-16 h-16 rounded-full border-4 border-brandGold shadow-lg mt-4 sm:mt-0"
            />
          </header>

          {/* Profile Completion Warning */}
          {displayUser && !displayUser.profileCompleted && (
            <motion.div
              className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-white/90 mb-3">
                    Fill in your profile information to connect with coursemates and unlock all features!
                  </p>
                  <a
                    href="/profile/edit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brandGold rounded-lg hover:bg-brandGold/80 transition font-semibold"
                  >
                    <Edit className="w-5 h-5" />
                    Complete Profile Now
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <section id="stats">
            <h2 className="text-3xl font-bold text-brandGold mb-6">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="bg-brandEmerald/20 border border-brandEmerald/30 rounded-2xl shadow-lg p-6 backdrop-blur-md hover:border-brandGold transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-brandGold/30 rounded-full">
                    <Users className="w-8 h-8 text-brandGold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 uppercase tracking-wide">Total Students</p>
                    <p className="text-4xl font-bold text-brandGold">
                      {displayStats.totalUsers}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-brandEmerald/20 border border-brandEmerald/30 rounded-2xl shadow-lg p-6 backdrop-blur-md hover:border-brandGold transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-brandSky/30 rounded-full">
                    <BookOpen className="w-8 h-8 text-brandSky" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 uppercase tracking-wide">Same University</p>
                    <p className="text-4xl font-bold text-brandSky">
                      {displayStats.sameUniversity}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-brandEmerald/20 border border-brandEmerald/30 rounded-2xl shadow-lg p-6 backdrop-blur-md hover:border-brandGold transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-brandEmerald/30 rounded-full">
                    <TrendingUp className="w-8 h-8 text-brandEmerald" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 uppercase tracking-wide">Same Course</p>
                    <p className="text-4xl font-bold text-brandEmerald">
                      {displayStats.sameCourse}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* User Profile Section */}
          <section id="profile">
            <motion.div
              className="bg-brandEmerald/20 border border-brandEmerald/30 rounded-2xl shadow-lg p-8 backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center border-b border-brandEmerald/30 pb-4 mb-6">
                <h2 className="text-3xl font-bold text-brandGold">Your Profile</h2>
                <a
                  href="/profile/edit"
                  className="flex items-center gap-2 px-4 py-2 bg-brandGold rounded-lg hover:bg-brandGold/80 transition text-white font-semibold"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </a>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-lg">
                <div>
                  <p className="text-brandGold/70 text-sm uppercase tracking-wide mb-1">Full Name</p>
                  <p className="font-semibold text-xl">{displayUser?.fullName || "Not set"}</p>
                </div>
                <div>
                  <p className="text-brandGold/70 text-sm uppercase tracking-wide mb-1">Email</p>
                  <p className="font-semibold text-xl">{displayUser?.email || "Not set"}</p>
                </div>
                <div>
                  <p className="text-brandGold/70 text-sm uppercase tracking-wide mb-1">University</p>
                  <p className="font-semibold text-xl">{displayUser?.university || "Not set"}</p>
                </div>
                <div>
                  <p className="text-brandGold/70 text-sm uppercase tracking-wide mb-1">Course</p>
                  <p className="font-semibold text-xl">{displayUser?.course || "Not set"}</p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Student Directory */}
          <section id="directory">
            <motion.div
              className="bg-brandEmerald/20 border border-brandEmerald/30 rounded-2xl shadow-lg p-8 backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-brandGold">Student Directory</h2>
                  <p className="text-white/70 mt-1">
                    {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"} found
                  </p>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-3 text-brandGold w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-3 w-full sm:w-64 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brandGold font-medium"
                  />
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-brandGold/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">
                    {searchTerm ? "No students match your search" : "Complete your profile to see other students"}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student, index) => (
                    <motion.div
                      key={student._id}
                      className="bg-white/10 rounded-xl p-6 border border-brandEmerald/30 hover:border-brandGold hover:bg-white/15 transition cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={student.profilePicture || `https://ui-avatars.com/api/?name=${student.fullName}&background=0D9488&color=fff&bold=true`}
                          alt={student.fullName}
                          className="w-12 h-12 rounded-full border-2 border-brandGold"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-brandGold">
                            {student.fullName}
                          </h3>
                          <p className="text-sm text-white/70">{student.yearOfStudy || "Student"}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-white/80">
                          <span className="font-semibold text-brandGold">University:</span>{" "}
                          {student.university || "Not specified"}
                        </p>
                        <p className="text-white/80">
                          <span className="font-semibold text-brandGold">Course:</span>{" "}
                          {student.course || "Not specified"}
                        </p>
                        {student.interests && student.interests.length > 0 && (
                          <p className="text-white/80">
                            <span className="font-semibold text-brandGold">Interests:</span>{" "}
                            {student.interests.join(", ")}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </section>

          {/* Quick Actions */}
          <section>
            <motion.div
              className="bg-brandEmerald/20 border border-brandEmerald/30 rounded-2xl shadow-lg p-8 backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-brandGold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="/directory"
                  className="p-6 bg-white/10 border-2 border-brandEmerald/30 rounded-xl hover:border-brandGold hover:bg-white/15 transition group"
                >
                  <Users className="w-10 h-10 text-brandGold mb-3 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-xl text-brandGold mb-2">Browse All Students</h4>
                  <p className="text-white/70">
                    Explore the full directory and connect with coursemates
                  </p>
                </a>

                <a
                  href="/profile/edit"
                  className="p-6 bg-white/10 border-2 border-brandEmerald/30 rounded-xl hover:border-brandGold hover:bg-white/15 transition group"
                >
                  <Edit className="w-10 h-10 text-brandGold mb-3 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-xl text-brandGold mb-2">Update Profile</h4>
                  <p className="text-white/70">
                    Keep your information current and complete
                  </p>
                </a>
              </div>
            </motion.div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}