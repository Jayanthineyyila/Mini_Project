import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ComplaintStatus } from "@/types/campusfix";

const styles: Record<ComplaintStatus, string> = {
  Pending: "bg-pending-soft text-pending border-pending/30",
  Ongoing: "bg-ongoing-soft text-ongoing border-ongoing/30",
  Resolved: "bg-resolved-soft text-resolved border-resolved/30",
};

export function StatusBadge({ status, className }: { status: ComplaintStatus; className?: string }) {
  return (
    <motion.span
      key={status}
      layout
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      <motion.span
        className="size-1.5 rounded-full bg-current"
        animate={status === "Ongoing" ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
        transition={{ repeat: status === "Ongoing" ? Infinity : 0, duration: 1.6 }}
      />
      {status}
    </motion.span>
  );
}
