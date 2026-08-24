import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { STATUSES, type Complaint, type ComplaintStatus } from "@/types/campusfix";

export function toCsv(rows: Complaint[]): string {
  const head = ["ID", "Issue type", "Location", "Status", "Reported by", "Created", "Description"];
  const body = rows.map((c) => [
    c._id,
    c.issueType,
    c.location,
    c.status,
    typeof c.reportedBy === "string" ? c.reportedBy : c.reportedBy.name,
    new Date(c.createdAt).toISOString(),
    c.description.replace(/\s+/g, " "),
  ]);
  return [head, ...body]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function ComplaintTable({
  complaints,
  selected,
  onToggle,
  onToggleAll,
  onBulkStatus,
  onExport,
}: {
  complaints: Complaint[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onBulkStatus: (status: ComplaintStatus) => void;
  onExport: () => void;
}) {
  const allChecked = complaints.length > 0 && selected.length === complaints.length;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <h3 className="text-sm font-semibold">All complaints</h3>
        <span className="text-xs text-muted-foreground">{selected.length} selected</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant="outline"
              disabled={selected.length === 0}
              onClick={() => onBulkStatus(s)}
            >
              Mark {s}
            </Button>
          ))}
          <Button size="sm" onClick={onExport}>
            <Download className="size-4" /> CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="bg-surface text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={allChecked} onChange={onToggleAll} aria-label="Select all" />
              </th>
              <th className="px-4 py-3 font-medium">Issue</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Reported by</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t border-border hover:bg-surface">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(c._id)}
                    onChange={() => onToggle(c._id)}
                    aria-label={`Select ${c.issueType}`}
                  />
                </td>
                <td className="px-4 py-3 font-medium">{c.issueType}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.location}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {typeof c.reportedBy === "string" ? c.reportedBy : c.reportedBy.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No complaints match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
