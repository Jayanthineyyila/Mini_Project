import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ISSUE_TYPES, LOCATIONS } from "@/types/campusfix";

export interface Filters {
  block: string;
  type: string;
  from: string;
  to: string;
}

export const emptyFilters: Filters = { block: "all", type: "all", from: "", to: "" };

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const dirty = JSON.stringify(filters) !== JSON.stringify(emptyFilters);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Filter className="size-4" /> Filters
      </div>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Block
        <select
          value={filters.block}
          onChange={(e) => set({ block: e.target.value })}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
        >
          <option value="all">All blocks</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Issue type
        <select
          value={filters.type}
          onChange={(e) => set({ type: e.target.value })}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
        >
          <option value="all">All types</option>
          {ISSUE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        From
        <Input
          type="date"
          value={filters.from}
          onChange={(e) => set({ from: e.target.value })}
          className="h-9 w-[9.5rem]"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        To
        <Input
          type="date"
          value={filters.to}
          onChange={(e) => set({ to: e.target.value })}
          className="h-9 w-[9.5rem]"
        />
      </label>

      {dirty && (
        <Button variant="ghost" size="sm" onClick={() => onChange(emptyFilters)}>
          <X className="size-4" /> Clear
        </Button>
      )}
    </div>
  );
}
