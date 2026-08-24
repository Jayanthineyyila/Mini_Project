import type { Analytics, Complaint, ComplaintStatus, User } from "@/types/campusfix";
import { ISSUE_TYPES, LOCATIONS } from "@/types/campusfix";

/** Local demo backend, persisted in localStorage until a real API URL is set. */
const KEY = "campusfix_mock_db";

interface Db {
  users: (User & { password: string })[];
  complaints: Complaint[];
}

const DEMO_STUDENT: User & { password: string } = {
  _id: "u_student",
  name: "Ananya Rao",
  email: "student@rguktsklm.ac.in",
  rollNumber: "o220541",
  hostelBlock: "Girls Block-1",
  role: "student",
  password: "password",
};

const DEMO_ADMIN: User & { password: string } = {
  _id: "u_admin",
  name: "Campus Admin",
  email: "admin@rguktsklm.ac.in",
  rollNumber: "ADM001",
  hostelBlock: "Administration",
  role: "admin",
  password: "password",
};

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function seed(): Db {
  const c = (
    i: number,
    issueType: (typeof ISSUE_TYPES)[number],
    location: (typeof LOCATIONS)[number],
    status: ComplaintStatus,
    description: string,
    age: number,
  ): Complaint => ({
    _id: `c_${i}`,
    reportedBy: { _id: DEMO_STUDENT._id, name: DEMO_STUDENT.name, rollNumber: DEMO_STUDENT.rollNumber },
    issueType,
    location,
    description,
    status,
    statusHistory: [
      { status: "Reported", changedAt: hoursAgo(age) },
      ...(status !== "Pending" ? [{ status: "Acknowledged", changedAt: hoursAgo(age - 2) }] : []),
      ...(status !== "Pending" ? [{ status: "Ongoing", changedAt: hoursAgo(age - 4) }] : []),
      ...(status === "Resolved" ? [{ status: "Resolved", changedAt: hoursAgo(age - 10) }] : []),
    ],
    upvotes: [],
    createdAt: hoursAgo(age),
  });

  return {
    users: [DEMO_STUDENT, DEMO_ADMIN],
    complaints: [
      c(1, "Pipe breakage", "Girls Block-1", "Pending", "Water pipe near the second floor washroom burst last night.", 6),
      c(2, "Broken tap", "Mess Girls", "Ongoing", "Tap next to the wash basin does not close, water wasting all day.", 30),
      c(3, "Electrical", "Bahuda", "Resolved", "Corridor tube light flickering and switch board sparking.", 72),
      c(4, "Furniture", "New Complex Classrooms", "Pending", "Three benches in room NC-204 have broken legs.", 12),
      c(5, "Road patch", "Boys Block", "Ongoing", "Large pothole on the path between hostel and mess.", 48),
      c(6, "Electrical", "Akshaya", "Resolved", "Ceiling fan in room 112 stopped working completely.", 96),
      c(7, "Broken tap", "Nagavalli", "Pending", "Wash area tap leaking continuously since Monday.", 20),
      c(8, "Pipe breakage", "Mess Boys", "Resolved", "Drainage pipe blocked behind the kitchen area.", 120),
    ],
  };
}

function read(): Db {
  if (typeof window === "undefined") return seed();
  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    const db = seed();
    window.localStorage.setItem(KEY, JSON.stringify(db));
    return db;
  }
  try {
    return JSON.parse(raw) as Db;
  } catch {
    return seed();
  }
}

function write(db: Db) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(db));
}

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const strip = (u: User & { password: string }): User => {
  const { password: _password, ...rest } = u;
  return rest;
};

export const mockDb = {
  async login(email: string, password: string) {
    await delay();
    const db = read();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) throw new Error("Invalid email or password.");
    return { token: `mock.${user._id}`, user: strip(user) };
  },

  async signup(input: Omit<User, "_id" | "role"> & { password: string }) {
    await delay();
    const db = read();
    if (db.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase()))
      throw new Error("An account with this email already exists.");
    const user = { ...input, _id: `u_${Date.now()}`, role: "student" as const };
    db.users.push(user);
    write(db);
    return { token: `mock.${user._id}`, user: strip(user) };
  },

  async me(token: string) {
    await delay(200);
    const db = read();
    const user = db.users.find((u) => `mock.${u._id}` === token);
    if (!user) throw new Error("Session expired.");
    return strip(user);
  },

  async myComplaints(userId: string) {
    await delay();
    return read()
      .complaints.filter((c) => (typeof c.reportedBy === "string" ? c.reportedBy : c.reportedBy._id) === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async allComplaints() {
    await delay();
    return read().complaints.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async create(input: Omit<Complaint, "_id" | "status" | "statusHistory" | "upvotes" | "createdAt">) {
    await delay(700);
    const db = read();
    const complaint: Complaint = {
      ...input,
      _id: `c_${Date.now()}`,
      status: "Pending",
      statusHistory: [{ status: "Reported", changedAt: new Date().toISOString() }],
      upvotes: [],
      createdAt: new Date().toISOString(),
    };
    db.complaints.unshift(complaint);
    write(db);
    return complaint;
  },

  async updateStatus(id: string, status: ComplaintStatus) {
    await delay(250);
    const db = read();
    const c = db.complaints.find((x) => x._id === id);
    if (!c) throw new Error("Complaint not found.");
    c.status = status;
    c.statusHistory.push({ status, changedAt: new Date().toISOString() });
    write(db);
    return c;
  },

  async analytics(): Promise<Analytics> {
    await delay();
    const complaints = read().complaints;
    const count = (key: (c: Complaint) => string, keys: readonly string[]) =>
      keys
        .map((name) => ({ name, value: complaints.filter((c) => key(c) === name).length }))
        .filter((d) => d.value > 0);
    return {
      byBlock: count((c) => c.location, LOCATIONS),
      byType: count((c) => c.issueType, ISSUE_TYPES),
      totals: {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === "Pending").length,
        ongoing: complaints.filter((c) => c.status === "Ongoing").length,
        resolved: complaints.filter((c) => c.status === "Resolved").length,
      },
      avgResolutionHours: 26,
    };
  },
};
