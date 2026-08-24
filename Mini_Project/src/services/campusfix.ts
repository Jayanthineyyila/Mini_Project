import api, { USE_MOCK_API, getToken } from "./api";
import { mockDb } from "./mockDb";
import type { Analytics, Complaint, ComplaintStatus, User } from "@/types/campusfix";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupInput {
  name: string;
  email: string;
  rollNumber: string;
  hostelBlock: string;
  password: string;
}

export interface NewComplaintInput {
  issueType: Complaint["issueType"];
  location: Complaint["location"];
  description: string;
  image?: File | null;
  imageUrl?: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK_API) return mockDb.login(email, password);
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    return data;
  },
  async signup(input: SignupInput): Promise<AuthResponse> {
    if (USE_MOCK_API) return mockDb.signup(input);
    const { data } = await api.post<AuthResponse>("/auth/signup", input);
    return data;
  },
  async me(): Promise<User> {
    const token = getToken();
    if (!token) throw new Error("Not authenticated.");
    if (USE_MOCK_API) return mockDb.me(token);
    const { data } = await api.get<User>("/auth/me");
    return data;
  },
};

export const complaintsApi = {
  async mine(userId: string): Promise<Complaint[]> {
    if (USE_MOCK_API) return mockDb.myComplaints(userId);
    const { data } = await api.get<Complaint[]>("/complaints");
    return data;
  },
  async create(input: NewComplaintInput, user: User): Promise<Complaint> {
    if (USE_MOCK_API) {
      return mockDb.create({
        issueType: input.issueType,
        location: input.location,
        description: input.description,
        ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
        reportedBy: { _id: user._id, name: user.name, rollNumber: user.rollNumber },
      });
    }
    const form = new FormData();
    form.append("issueType", input.issueType);
    form.append("location", input.location);
    form.append("description", input.description);
    if (input.image) form.append("image", input.image);
    const { data } = await api.post<Complaint>("/complaints", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export const adminApi = {
  async complaints(): Promise<Complaint[]> {
    if (USE_MOCK_API) return mockDb.allComplaints();
    const { data } = await api.get<Complaint[]>("/admin/complaints");
    return data;
  },
  async updateStatus(id: string, status: ComplaintStatus): Promise<Complaint> {
    if (USE_MOCK_API) return mockDb.updateStatus(id, status);
    const { data } = await api.patch<Complaint>(`/complaints/${id}/status`, { status });
    return data;
  },
  async analytics(): Promise<Analytics> {
    if (USE_MOCK_API) return mockDb.analytics();
    const { data } = await api.get<Analytics>("/admin/analytics");
    return data;
  },
};
