"use client";

import { motion } from "framer-motion";
import VectorAvatar from "./VectorAvatar";
import type { AvatarState } from "./types";



export default function AvatarRenderer({ state }: { state: AvatarState }) {
  return (
    <motion.div
      initial={{ x: -240, opacity: 0 }}
      animate={{
        x: state === "walk-in" ? 120 : 28,
        opacity: 1,
      }}
      transition={{ duration: 3, ease: "easeInOut" }}
      className="relative"
    >
      <VectorAvatar state={state} />
    </motion.div>
  );
}
