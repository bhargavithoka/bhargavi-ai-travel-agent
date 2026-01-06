"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, MapPin, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { SparkleBackground } from "../components/common/SparkleBackground";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <SparkleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10"
        >
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to view your profile</h1>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleSave = () => {
    // Mock save - in real app, this would update the backend
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen relative">
      <SparkleBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Travel AI
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(user.name)}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-white/60 flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </p>
                <p className="text-white/40 text-sm mt-1">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Trip History Placeholder */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MapPin size={20} />
              Trip History
            </h2>

            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white/60 mb-2">No trips yet</h3>
              <p className="text-white/40 mb-6">
                Your saved trips and travel history will appear here
              </p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Plan Your First Trip
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}