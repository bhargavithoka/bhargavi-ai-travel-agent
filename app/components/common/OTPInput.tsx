"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string;
  disabled?: boolean;
}

export function OTPInput({ length = 6, onComplete, error, disabled = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpString = newOtp.join("");
    if (otpString.length === length) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    const pasteArray = pasteData.split("");

    const newOtp = [...otp];
    pasteArray.forEach((char, index) => {
      if (index < length && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextIndex = pasteArray.length < length ? pasteArray.length : length - 1;
    inputRefs.current[nextIndex]?.focus();

    // Check if OTP is complete
    const otpString = newOtp.join("");
    if (otpString.length === length) {
      onComplete(otpString);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-12 h-12 text-center text-xl font-semibold bg-white/10 border rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-colors ${
              error
                ? "border-red-400 focus:ring-red-400/50"
                : "border-white/20 focus:ring-blue-400/50 focus:border-blue-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            maxLength={1}
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}