import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Inbox } from "lucide-react";
import { PageShell, PageHeading } from "@/components/layout/PageShell";
import { FilterBar, emptyFilters, type Filters } from "@/components/admin/FilterBar";
import { KanbanBoard } from "@/components/admin/KanbanBoard";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { ComplaintTable, toCsv } from "@/components/admin/ComplaintTable";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonCard, SkeletonRow } from "@/components/common/SkeletonCard";
import { adminApi } from "@/services/campusfix";
import type { Complaint, ComplaintStatus } from "@/types/campusfix";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — CampusFix" },
      {
        name: "description",
        content:
          "Kanban board, filters, analytics and CSV export for campus maintenance complaints at RGUKT Srikakulam.",
      },
      { property: "og:title", content: "Admin Dashboard — CampusFix" },
      { property: "og:description", content: "Triage and resolve student complaints across every block." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selected, setSelected] = useState<string[]>([]);

  const complaintsQuery = useQuery({ queryKey: ["admin", "complaints"], queryFn: adminApi.complaints });
  const analyticsQuery = useQuery({ queryKey: ["admin", "analytics"], queryFn: adminApi.analytics });

  const filtered = useMemo(() => {
    const list = complaintsQuery.data ?? [];
    return list.filter((c) => {
      if (filters.block !== "all" && c.location !== filters.block) return false;
      if (filters.type !== "all" && c.issueType !== filters.type) return false;
      const created = new Date(c.createdAt).getTime();
      if (filters.from && created < new Date(filters.from).getTime()) return false;
      if (filters.to && created > new Date(filters.to).getTime() + 86_400_000) return false;
      return true;
    });
  }, [complaintsQuery.data, filters]);

  async function setStatus(ids: string[], status: ComplaintStatus) {
    try {
      await Promise.all(ids.map((id) => adminApi.updateStatus(id, status)));
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success(`${ids.length} complaint${ids.length > 1 ? "s" : ""} marked ${status}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the status.");
    }
  }

  function exportCsv(rows: Complaint[]) {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campusfix-complaints-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported.");
  }

  return (
    <PageShell className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <PageHeading
        eyebrow="Administration"
        title="Complaints control room"
        description="Drag cards between columns to move work forward, filter by block or issue type, and export the register."
      />

      <div className="mt-8 space-y-6">
        <FilterBar filters={filters} onChange={setFilters} />

        {analyticsQuery.isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : analyticsQuery.data ? (
          <AnalyticsPanel data={analyticsQuery.data} />
        ) : null}

        {complaintsQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No complaints to show"
            description="Nothing matches the current filters. Clear them to see the full register."
          />
        ) : (
          <KanbanBoard complaints={filtered} onStatusChange={(id, s) => void setStatus([id], s)} />
        )}

        {complaintsQuery.isLoading ? (
          <div className="rounded-3xl border border-border bg-card">
            {[0, 1, 2].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : (
          <ComplaintTable
            complaints={filtered}
            selected={selected}
            onToggle={(id) =>
              setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
            }
            onToggleAll={() =>
              setSelected((s) => (s.length === filtered.length ? [] : filtered.map((c) => c._id)))
            }
            onBulkStatus={(status) => {
              void setStatus(selected, status);
              setSelected([]);
            }}
            onExport={() => exportCsv(filtered)}
          />
        )}
      </div>
    </PageShell>
  );
}
