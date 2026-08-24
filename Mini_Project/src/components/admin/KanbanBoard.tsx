import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GripVertical, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUSES, type Complaint, type ComplaintStatus } from "@/types/campusfix";

const columnAccent: Record<ComplaintStatus, string> = {
  Pending: "bg-pending",
  Ongoing: "bg-ongoing",
  Resolved: "bg-resolved",
};

export function KanbanBoard({
  complaints,
  onStatusChange,
}: {
  complaints: Complaint[];
  onStatusChange: (id: string, status: ComplaintStatus) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<ComplaintStatus | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STATUSES.map((status) => {
        const items = complaints.filter((c) => c.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(status);
            }}
            onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              setOverCol(null);
              if (dragId) onStatusChange(dragId, status);
              setDragId(null);
            }}
            className={cn(
              "flex min-h-[22rem] flex-col rounded-3xl border border-border bg-surface p-3 transition-colors",
              overCol === status && "border-primary bg-accent",
            )}
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={cn("size-2 rounded-full", columnAccent[status])} />
              <h3 className="text-sm font-semibold">{status}</h3>
              <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                {items.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <AnimatePresence mode="popLayout">
                {items.map((c) => (
                  <motion.div
                    key={c._id}
                    layout
                    layoutId={c._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    whileHover={{ y: -3 }}
                    whileDrag={{ scale: 1.04, rotate: -1.5 }}
                    draggable
                    onDragStart={() => setDragId(c._id)}
                    onDragEnd={() => setDragId(null)}
                    className="cursor-grab rounded-2xl border border-border bg-card p-3.5 shadow-soft active:cursor-grabbing"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{c.issueType}</p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" /> {c.location}
                        </p>
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {items.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                  Drag cards here
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
