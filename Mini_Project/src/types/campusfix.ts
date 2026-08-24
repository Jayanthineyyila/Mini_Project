export const ISSUE_TYPES = [
  "Pipe breakage",
  "Broken tap",
  "Electrical",
  "Furniture",
  "Road patch",
  "Other",
] as const;

export const LOCATIONS = [
  "Girls Block-1",
  "Girls Block-2",
  "Boys Block",
  "Mess Girls",
  "Mess Boys",
  "New Complex Classrooms",
  "Bahuda",
  "Akshaya",
  "Nagavalli",
  "Mahendra Tanaya",
  "Suvarnamukhi",
  "Champavathi",
  "Vegavathi",
] as const;

export const STATUSES = ["Pending", "Ongoing", "Resolved"] as const;

export type IssueType = (typeof ISSUE_TYPES)[number];
export type CampusLocation = (typeof LOCATIONS)[number];
export type ComplaintStatus = (typeof STATUSES)[number];

export type Role = "student" | "admin" | "warden";

export interface User {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  hostelBlock: string;
  role: Role;
}

export interface StatusEvent {
  status: string;
  changedAt: string;
}

export interface Complaint {
  _id: string;
  reportedBy: Pick<User, "_id" | "name" | "rollNumber"> | string;
  issueType: IssueType;
  location: CampusLocation;
  description: string;
  imageUrl?: string;
  status: ComplaintStatus;
  statusHistory: StatusEvent[];
  upvotes: string[];
  createdAt: string;
}

export interface Analytics {
  byBlock: { name: string; value: number }[];
  byType: { name: string; value: number }[];
  totals: { total: number; pending: number; ongoing: number; resolved: number };
  avgResolutionHours: number;
}

export const TIMELINE_STEPS = ["Reported", "Acknowledged", "Ongoing", "Resolved"] as const;

export function timelineIndex(c: Complaint): number {
  const seen = new Set(c.statusHistory.map((s) => s.status));
  if (c.status === "Resolved") return 3;
  if (c.status === "Ongoing") return 2;
  if (seen.has("Acknowledged")) return 1;
  return 0;
}
