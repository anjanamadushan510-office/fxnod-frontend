import { api } from "./api";
import type { UserPublic } from "./authApi";

export const adminApi = {
  login: async (credentials: { email: string; password: string }) => {
    // We explicitly call the admin login endpoint
    // It will set the fxnod_admin_refresh httpOnly cookie
    const res = await api.post("/api/v1/auth/admin/login", credentials);
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get<UserPublic[]>("/api/v1/admin/users");
    return res.data;
  },
  getManualDeposits: async () => {
    const res = await api.get("/api/v1/admin/wallet/deposits/manual");
    return res.data;
  },
  approveManualDeposit: async (id: string, note?: string) => {
    const res = await api.post(`/api/v1/admin/wallet/deposits/manual/${id}/approve`, { admin_note: note });
    return res.data;
  },
  rejectManualDeposit: async (id: string, note?: string) => {
    const res = await api.post(`/api/v1/admin/wallet/deposits/manual/${id}/reject`, { admin_note: note });
    return res.data;
  },
};
