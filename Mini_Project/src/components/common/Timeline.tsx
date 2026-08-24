import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIMELINE_STEPS } from "@/types/campusfix";

export function Timeline({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex items-center">
      {TIMELINE_STEPS.map((step, i) => {
        const done = i <= activeIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: done ? 1 : 0.85,
                  backgroundColor: done ? "var(--primary)" : "var(--muted)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="flex size-6 items-center justify-center rounded-full"
              >
                {done ? (
                  <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                )}
              </motion.div>
              <span
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap",
                  done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className="mx-1.5 -mt-5 h-0.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: i < activeIndex ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  style={{ transformOrigin: "left" }}
                  className="h-full bg-primary"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
