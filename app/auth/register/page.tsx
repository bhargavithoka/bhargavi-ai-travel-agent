"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone } from "lucide-react";
import { SparkleBackground } from "../../components/common/SparkleBackground";
import { OTPInput } from "../../components/common/OTPInput";

type RegistrationStep = "details" | "otp";

export default function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [error, setError] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const router = useRouter();

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Generate OTP code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);

      // Simulate sending OTP (in production, this would send to email/SMS service)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, show the OTP code
      alert(`Demo OTP Code: ${otp}\n\nIn a real app, this would be sent to your ${verificationMethod === "email" ? "email" : "phone"}.`);

      setStep("otp");
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setIsLoading(true);
    setOtpError("");

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate OTP against generated code
      if (otp === generatedOTP) {
        // Mock successful registration
        localStorage.setItem("user", JSON.stringify({
          id: Date.now().toString(),
          email,
          name,
          phone: phone || undefined,
          avatar: null
        }));
        router.push("/");
      } else {
        setOtpError("Invalid verification code");
      }
    } catch {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setOtpError("");

    try {
      // Generate new OTP code
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOtp);

      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, show the new OTP code
      alert(`New Demo OTP Code: ${newOtp}\n\nIn a real app, this would be sent to your ${verificationMethod === "email" ? "email" : "phone"}.`);
    } catch {
      setOtpError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <SparkleBackground />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-blue-500/20 border-2 border-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              {verificationMethod === "email" ? <Mail size={24} className="text-blue-400" /> : <Phone size={24} className="text-blue-400" />}
            </motion.div>
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Verify Your Account
            </motion.h1>
            <motion.p
              className="text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Enter the 6-digit code sent to your {verificationMethod === "email" ? "email" : "phone"}
            </motion.p>
            <motion.p
              className="text-yellow-400/80 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Demo: Check the alert popup for the verification code
            </motion.p>
            <motion.p
              className="text-white/40 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {verificationMethod === "email" ? email : phone}
            </motion.p>
          </div>

          {/* OTP Form */}
          <motion.div
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <OTPInput
              onComplete={handleOTPComplete}
              error={otpError}
              disabled={isLoading}
            />

            <div className="mt-6 space-y-4">
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="w-full text-blue-400 hover:text-blue-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Didn&apos;t receive the code? Resend
              </button>

              <button
                onClick={() => setStep("details")}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg py-3 px-4 transition-colors"
              >
                Back to Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <SparkleBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join Travel AI
          </motion.h1>
          <motion.p
            className="text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create your account to start planning amazing trips
          </motion.p>
        </div>

        {/* Register Form */}
        <motion.div
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                Phone Number <span className="text-white/40">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            {/* Verification Method */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Verification Method
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="verification"
                    value="email"
                    checked={verificationMethod === "email"}
                    onChange={(e) => setVerificationMethod(e.target.value as "email")}
                    className="text-blue-400 focus:ring-blue-400"
                  />
                  <span className="text-white/80">Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="verification"
                    value="phone"
                    checked={verificationMethod === "phone"}
                    onChange={(e) => setVerificationMethod(e.target.value as "phone")}
                    disabled={!phone}
                    className="text-blue-400 focus:ring-blue-400 disabled:opacity-50"
                  />
                  <span className={`text-white/80 ${!phone ? "opacity-50" : ""}`}>Phone</span>
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/20 border border-red-500/30 rounded-lg p-3"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Sending Code...
                </>
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{" "}
              <a href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}