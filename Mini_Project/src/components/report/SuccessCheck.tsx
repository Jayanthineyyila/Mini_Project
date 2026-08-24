import { motion } from "motion/react";

export function SuccessCheck() {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="size-20"
      initial="hidden"
      animate="visible"
      aria-hidden="true"
    >
      <motion.circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke="var(--resolved)"
        strokeWidth="3"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      <motion.path
        d="M20 33.5 L28.5 42 L45 24"
        fill="none"
        stroke="var(--resolved)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.45, delay: 0.55, ease: "easeOut" }}
      />
    </motion.svg>
  );
}
