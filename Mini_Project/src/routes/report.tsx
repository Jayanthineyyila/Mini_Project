import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Lock, MapPin, Wrench } from "lucide-react";
import { PageShell, PageHeading } from "@/components/layout/PageShell";
import { StepIndicator } from "@/components/report/StepIndicator";
import { PhotoUpload } from "@/components/report/PhotoUpload";
import { SuccessCheck } from "@/components/report/SuccessCheck";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { complaintsApi } from "@/services/campusfix";
import { cn } from "@/lib/utils";
import { ISSUE_TYPES, LOCATIONS, type CampusLocation, type IssueType } from "@/types/campusfix";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — CampusFix" },
      {
        name: "description",
        content:
          "Report a broken tap, burst pipe, electrical fault, damaged furniture or road patch anywhere on the RGUKT Srikakulam campus.",
      },
      { property: "og:title", content: "Report an Issue — CampusFix" },
      { property: "og:description", content: "Four quick steps: issue type, location, photo, description." },
    ],
  }),
  component: ReportPage,
});

const STEPS = ["Issue type", "Location", "Photo", "Details"];

function ReportPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [issueType, setIssueType] = useState<IssueType | null>(null);
  const [location, setLocation] = useState<CampusLocation | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const canContinue =
    (step === 0 && !!issueType) ||
    (step === 1 && !!location) ||
    step === 2 ||
    (step === 3 && description.trim().length > 9);

  async function submit() {
    if (!user || !issueType || !location) return;
    setSubmitting(true);
    try {
      await complaintsApi.create(
        { issueType, location, description: description.trim(), image, ...(preview ? { imageUrl: preview } : {}) },
        user,
      );
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
      setDone(true);
      toast.success("Complaint submitted. The maintenance team has been notified.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit the complaint.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && !user) {
    return (
      <PageShell className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={Lock}
          title="Log in to report an issue"
          description="Complaints are linked to your roll number and hostel block so the team knows where to go."
          action={
            <Button asChild>
              <Link to="/login">Log in</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  if (done) {
    return (
      <PageShell className="grid place-items-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex max-w-md flex-col items-center rounded-3xl border border-border bg-card p-10 text-center shadow-lift"
        >
          <SuccessCheck />
          <h2 className="mt-5 text-2xl font-bold">Report submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your {issueType?.toLowerCase()} complaint at {location} is now marked Pending. You will
            see the status change on your dashboard.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button onClick={() => void navigate({ to: "/dashboard" })}>View my reports</Button>
            <Button
              variant="outline"
              onClick={() => {
                setDone(false);
                setStep(0);
                setIssueType(null);
                setLocation(null);
                setImage(null);
                setPreview(null);
                setDescription("");
              }}
            >
              Report another
            </Button>
          </div>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <PageHeading
        eyebrow="New complaint"
        title="Report an issue"
        description="Four short steps. Adding a photo helps the maintenance team fix it faster."
      />

      <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
        <StepIndicator step={step} labels={STEPS} />

        <div className="relative mt-8 min-h-[19rem] overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ x: dir * 48, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: dir * -48, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {step === 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {ISSUE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setIssueType(t)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left text-sm font-medium transition-all hover:border-primary/50",
                        issueType === t && "border-primary bg-accent text-primary",
                      )}
                    >
                      <Wrench className="size-4 shrink-0" /> {t}
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {LOCATIONS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLocation(l)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm font-medium transition-all hover:border-primary/50",
                        location === l && "border-primary bg-accent text-primary",
                      )}
                    >
                      <MapPin className="size-4 shrink-0" /> {l}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <PhotoUpload
                  preview={preview}
                  onChange={(file, p) => {
                    setImage(file);
                    setPreview(p);
                  }}
                />
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-surface p-4 text-sm">
                    <p className="font-semibold">{issueType}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{location}</p>
                  </div>
                  <Textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the problem — where exactly it is, since when, and how badly it affects students."
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.trim().length < 10
                      ? "Please add at least 10 characters."
                      : `${description.trim().length} characters`}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button variant="ghost" disabled={step === 0} onClick={() => go(step - 1)}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < 3 ? (
            <Button disabled={!canContinue} onClick={() => go(step + 1)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button disabled={!canContinue || submitting} onClick={() => void submit()}>
              {submitting ? "Submitting…" : "Submit report"} <Check className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
