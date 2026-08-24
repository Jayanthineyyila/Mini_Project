import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Plus } from "lucide-react";
import { PageShell, PageHeading } from "@/components/layout/PageShell";
import { ComplaintCard } from "@/components/report/ComplaintCard";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { complaintsApi } from "@/services/campusfix";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Reports — CampusFix" },
      {
        name: "description",
        content: "Track the status of every campus maintenance issue you have reported at RGUKT Srikakulam.",
      },
      { property: "og:title", content: "My Reports — CampusFix" },
      { property: "og:description", content: "Follow your complaints from Reported to Resolved." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["complaints", "mine", user?._id],
    queryFn: () => complaintsApi.mine(user!._id),
    enabled: !!user,
  });

  return (
    <PageShell className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <PageHeading
        eyebrow="Student dashboard"
        title={user ? `Hello, ${user.name.split(" ")[0]}` : "My reports"}
        description="Every issue you have reported, with a live progress timeline from Reported through Resolved."
        actions={
          <Button asChild>
            <Link to="/report">
              <Plus className="size-4" /> New report
            </Link>
          </Button>
        }
      />

      <div className="mt-10">
        {loading || (user && isLoading) ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : !user ? (
          <EmptyState
            icon={ClipboardList}
            title="Log in to see your reports"
            description="Your complaints are tied to your roll number, so you need to be signed in to track them."
            action={
              <Button asChild>
                <Link to="/login">Log in</Link>
              </Button>
            }
          />
        ) : data && data.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((c, i) => (
              <ComplaintCard key={c._id} complaint={c} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No reports yet"
            description="When you report a broken tap, burst pipe or faulty light, it will show up here with its status."
            action={
              <Button asChild>
                <Link to="/report">Report an issue</Link>
              </Button>
            }
          />
        )}
      </div>
    </PageShell>
  );
}
