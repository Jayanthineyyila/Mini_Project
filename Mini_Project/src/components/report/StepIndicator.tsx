import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function StepIndicator({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {labels.map((label, i) => (
        <div key={label} className="flex flex-1 flex-col gap-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ scaleX: i <= step ? 1 : 0 }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 0.4 }}
              className="h-full bg-brand-gradient"
            />
          </div>
          <span
            className={cn(
              "text-[10px] font-medium sm:text-xs",
              i <= step ? "text-primary" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
