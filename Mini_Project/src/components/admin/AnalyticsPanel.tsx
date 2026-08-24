import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "motion/react";
import type { Analytics } from "@/types/campusfix";

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`mt-1 font-serif text-2xl font-bold ${tone ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}

export function AnalyticsPanel({ data }: { data: Analytics }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Total reports" value={data.totals.total} />
        <Stat label="Pending" value={data.totals.pending} tone="text-pending" />
        <Stat label="Ongoing" value={data.totals.ongoing} tone="text-ongoing" />
        <Stat label="Resolved" value={data.totals.resolved} tone="text-resolved" />
        <Stat label="Avg resolution" value={`${data.avgResolutionHours}h`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <h3 className="text-sm font-semibold">Issues by block</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byBlock} margin={{ left: -20, bottom: 40 }}>
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <h3 className="text-sm font-semibold">Issues by type</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byType}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {data.byType.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length] ?? "var(--chart-1)"} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
