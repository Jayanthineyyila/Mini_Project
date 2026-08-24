import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found — CampusFix" },
      { name: "description", content: "This CampusFix page does not exist." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Page not found — CampusFix" },
      { property: "og:description", content: "This CampusFix page does not exist." },
    ],
  }),
  component: NotFound,
});

function NotFound() {
  return (
    <PageShell className="grid place-items-center px-4 py-28">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="font-serif text-7xl font-bold text-brand-gradient">404</p>
        <h1 className="mt-4 text-2xl font-bold">This page is not on the campus map</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          The link may be broken or the page may have moved. Head back and try again.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/report">Report an issue</Link>
          </Button>
        </div>
      </motion.div>
    </PageShell>
  );
}
