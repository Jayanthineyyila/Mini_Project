import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  withFooter = true,
}: {
  children: ReactNode;
  className?: string;
  withFooter?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn("flex-1", className)}
      >
        {children}
      </motion.main>
      {withFooter && <Footer />}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-1.5 text-3xl font-bold">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
