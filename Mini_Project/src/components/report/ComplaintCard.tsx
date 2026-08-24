import { motion } from "motion/react";
import { Calendar, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Timeline } from "@/components/common/Timeline";
import { timelineIndex, type Complaint } from "@/types/campusfix";

export function ComplaintCard({ complaint, index = 0 }: { complaint: Complaint; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="h-36 w-full overflow-hidden bg-soft-gradient">
        {complaint.imageUrl ? (
          <img
            src={complaint.imageUrl}
            alt={`${complaint.issueType} at ${complaint.location}`}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center font-serif text-sm text-muted-foreground">
            No photo attached
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold">{complaint.issueType}</h3>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {complaint.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{complaint.description}</p>

        <div className="mt-auto pt-4">
          <Timeline activeIndex={timelineIndex(complaint)} />
        </div>
      </div>
    </motion.article>
  );
}
