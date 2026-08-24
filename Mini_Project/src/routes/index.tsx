import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CameraIcon, ClipboardList, LineChart, ShieldCheck, Zap } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusFix — Report Campus Issues at RGUKT Srikakulam" },
      {
        name: "description",
        content:
          "CampusFix lets RGUKT Srikakulam students report hostel and campus maintenance issues with a photo and track them until they are resolved.",
      },
      { property: "og:title", content: "CampusFix — RGUKT Srikakulam Issue Reporting" },
      {
        property: "og:description",
        content: "Report campus maintenance issues in seconds and follow every status update.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: CameraIcon,
    title: "Report with a photo",
    body: "Snap the broken tap or burst pipe, pick the block, and submit in under a minute from your phone.",
  },
  {
    icon: ClipboardList,
    title: "Track every step",
    body: "A live timeline moves from Reported to Acknowledged, Ongoing and finally Resolved.",
  },
  {
    icon: Zap,
    title: "Faster maintenance",
    body: "Complaints reach the right warden instantly instead of sitting in a paper register.",
  },
  {
    icon: LineChart,
    title: "Campus-wide insight",
    body: "Admins see which blocks and issue types need attention with live analytics.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

function Landing() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-soft-gradient">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary"
            >
              <ShieldCheck className="size-3.5" /> RGUKT Srikakulam · Official student portal
            </motion.span>

            <motion.h1 variants={item} className="mt-6 text-4xl leading-tight font-bold sm:text-6xl">
              Campus problems, <span className="text-brand-gradient">fixed faster.</span>
            </motion.h1>

            <motion.p variants={item} className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              CampusFix is the single place for students of RGUKT Srikakulam to report broken taps,
              burst pipes, electrical faults, damaged furniture and road patches — and to watch them
              get resolved, block by block.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/report">Report an Issue</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">Track My Complaints</Link>
              </Button>
            </motion.div>

            <motion.div variants={item} className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {[
                { k: "13", v: "Blocks covered" },
                { k: "6", v: "Issue categories" },
                { k: "24h", v: "Typical first response" },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-serif text-2xl font-bold text-primary sm:text-3xl">{s.k}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.v}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">How CampusFix works</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Built for the way students actually report problems — from a phone, with a picture, in the
          middle of a busy day.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-accent">
                <f.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center sm:px-12"
        >
          <h2 className="font-serif text-2xl font-bold text-primary-foreground sm:text-3xl">
            Something broken in your block?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80">
            Take a photo, choose your hostel or classroom, and let the maintenance team take it from
            there.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/report">Report an Issue</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup">Create student account</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
