import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { LOCATIONS } from "@/types/campusfix";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your student account — CampusFix" },
      {
        name: "description",
        content: "Sign up with your roll number and hostel block to start reporting campus issues.",
      },
      { property: "og:title", content: "Sign up — CampusFix RGUKT Srikakulam" },
      { property: "og:description", content: "Create a CampusFix student account in a minute." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    hostelBlock: LOCATIONS[0] as string,
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await signup(form);
      toast.success("Account created. Welcome to CampusFix!");
      void navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign up.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell withFooter={false} className="grid place-items-center bg-soft-gradient px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-lift"
      >
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          For students of RGUKT Srikakulam. Use your official university email.
        </p>

        <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="roll">Roll number</Label>
            <Input
              id="roll"
              required
              placeholder="o220541"
              value={form.rollNumber}
              onChange={(e) => set("rollNumber", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="block">Hostel block</Label>
            <select
              id="block"
              value={form.hostelBlock}
              onChange={(e) => set("hostelBlock", e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="pass">Password</Label>
            <Input
              id="pass"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full sm:col-span-2" disabled={busy}>
            {busy ? "Creating account…" : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </PageShell>
  );
}
