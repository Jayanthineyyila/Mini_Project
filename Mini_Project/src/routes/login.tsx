import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { USE_MOCK_API } from "@/services/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — CampusFix RGUKT Srikakulam" },
      { name: "description", content: "Log in to CampusFix to report and track campus maintenance issues." },
      { property: "og:title", content: "Log in — CampusFix" },
      { property: "og:description", content: "Access your CampusFix student account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      void navigate({ to: user.role === "student" ? "/dashboard" : "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell withFooter={false} className="grid place-items-center bg-soft-gradient px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lift"
      >
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Log in with your RGUKT email to manage your complaints.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="o220541@rguktsklm.ac.in"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </Button>
        </form>

        {USE_MOCK_API && (
          <div className="mt-5 rounded-2xl bg-surface p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Demo accounts</p>
            <p className="mt-1">student@rguktsklm.ac.in · password</p>
            <p>admin@rguktsklm.ac.in · password</p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </PageShell>
  );
}
