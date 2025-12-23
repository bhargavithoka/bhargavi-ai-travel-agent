"use client";

import { motion } from "framer-motion";
import type { AvatarState } from "./types";


function EmojiBurst({ emojis }: { emojis: string[] }) {
  return (
    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2">
      {emojis.map((e, i) => (
        <motion.span
          key={i}
          className="absolute text-xl"
          initial={{ opacity: 0, y: 10, x: 0, scale: 0.9 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-2, -28, -40],
            x: [0, (i - (emojis.length - 1) / 2) * 14, (i - (emojis.length - 1) / 2) * 20],
            scale: [0.9, 1.1, 1.0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  );
}

export default function VectorAvatar({ state }: { state: AvatarState }) {
  const isWalking = state === "walk-in";
  const isThinking = state === "thinking";
  const isWriting = state === "writing";
  const isHappy = state === "happy" || state === "thumbs-up" || state === "wave";

  // Arm animations by state
  const leftArmRotate = isWriting ? -25 : isThinking ? -8 : isHappy ? -12 : -2;
  const rightArmRotate = isWriting ? 35 : isThinking ? 10 : isHappy ? 18 : 4;

  // Leg animations for walking
  const legSwing = isWalking ? [18, -18, 18] : [0, 0, 0];

  // Small bobbing always (idle breathing)
  const bob = isWalking ? [0, -2, 0] : [0, -3, 0];

  return (
    <div className="relative">
      {/* Emoji reactions around the avatar (NOT the face) */}
      {isHappy && <EmojiBurst emojis={["✨", "👍", "💖"]} />}
      {isThinking && <EmojiBurst emojis={["🤔", "💡", "✨"]} />}
      {isWriting && <EmojiBurst emojis={["✍️", "📋", "💰"]} />}

      <motion.div
        animate={{ y: bob }}
        transition={{ duration: isWalking ? 0.6 : 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-72 w-40"
      >
        {/* Shadow */}
        <motion.div
          className="absolute bottom-3 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-black/10 blur-[1px]"
          animate={{ scaleX: isWalking ? [0.95, 1.05, 0.95] : [0.95, 1.0, 0.95], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: isWalking ? 0.6 : 2.6, repeat: Infinity }}
        />

        {/* SVG character */}
        <svg
          viewBox="0 0 180 320"
          className="h-full w-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.12)]"
        >
          {/* Hair */}
          <path
            d="M55 62c3-24 20-40 40-40s37 16 40 40c3 25-7 40-11 46-4 6-16 18-29 18s-25-12-29-18c-4-6-14-21-11-46z"
            fill="#2b2a33"
          />
          {/* Face */}
          <circle cx="95" cy="84" r="34" fill="#f5d7c6" />
          {/* Eyes */}
          <circle cx="83" cy="80" r="3.2" fill="#1f2937" />
          <circle cx="107" cy="80" r="3.2" fill="#1f2937" />
          {/* Smile */}
          <path d="M84 94c6 8 16 8 22 0" stroke="#b45309" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Scarf */}
          <path d="M65 120c10-8 50-8 60 0 2 2 2 6-1 8-16 10-42 10-58 0-3-2-3-6-1-8z" fill="#fb7185" opacity="0.9" />
          {/* Neck */}
          <rect x="88" y="110" width="14" height="18" rx="7" fill="#f5d7c6" />

          {/* Torso (travel jacket) */}
          <path d="M58 140c8-10 24-18 37-18s29 8 37 18l8 62c-8 8-28 12-45 12s-37-4-45-12l8-62z" fill="#6366f1" opacity="0.92" />
          {/* Inner shirt */}
          <path d="M78 140c6-6 26-6 32 0l-6 40c-6 4-14 4-20 0l-6-40z" fill="#ffffff" opacity="0.85" />

          {/* Left Arm */}
          <motion.g
            style={{ transformOrigin: "66px 152px" }}
            animate={{ rotate: leftArmRotate }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <path d="M66 152c-10 10-16 22-18 38-1 8 6 14 14 12 12-3 20-14 26-26" fill="#6366f1" opacity="0.92" />
            <circle cx="48" cy="210" r="10" fill="#f5d7c6" />
          </motion.g>

          {/* Right Arm */}
          <motion.g
            style={{ transformOrigin: "124px 152px" }}
            animate={{ rotate: rightArmRotate }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <path d="M124 152c10 10 16 22 18 38 1 8-6 14-14 12-12-3-20-14-26-26" fill="#6366f1" opacity="0.92" />
            <circle cx="142" cy="210" r="10" fill="#f5d7c6" />
            {/* Little “phone/notebook” when thinking */}
            {isThinking && <rect x="136" y="196" width="18" height="26" rx="4" fill="#111827" opacity="0.85" />}
            {/* Little “clipboard” when writing */}
            {isWriting && <rect x="132" y="196" width="26" height="22" rx="4" fill="#f9fafb" stroke="#111827" strokeWidth="2" opacity="0.95" />}
          </motion.g>

          {/* Legs */}
          {/* Left leg */}
          <motion.g
            style={{ transformOrigin: "84px 228px" }}
            animate={{ rotate: legSwing }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="78" y="220" width="16" height="62" rx="8" fill="#111827" opacity="0.9" />
            <rect x="74" y="276" width="26" height="12" rx="6" fill="#f9fafb" />
          </motion.g>

          {/* Right leg */}
          <motion.g
            style={{ transformOrigin: "104px 228px" }}
            animate={{ rotate: isWalking ? [-18, 18, -18] : [0, 0, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="98" y="220" width="16" height="62" rx="8" fill="#111827" opacity="0.9" />
            <rect x="94" y="276" width="26" height="12" rx="6" fill="#f9fafb" />
          </motion.g>

          {/* Small suitcase when Flights or walking */}
          {(isWalking) && (
            <>
              <rect x="28" y="230" width="30" height="40" rx="6" fill="#111827" opacity="0.9" />
              <rect x="35" y="220" width="16" height="10" rx="3" fill="#111827" opacity="0.9" />
              <circle cx="36" cy="272" r="4" fill="#9ca3af" />
              <circle cx="50" cy="272" r="4" fill="#9ca3af" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
