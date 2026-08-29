import { api } from "./api";
import type { UserPublic } from "./authApi";

export const adminApi = {
  getUsers: async (): Promise<UserPublic[]> => {
    const res = await api.get<UserPublic[]>("/api/v1/admin/users");
    return res.data;
  },
};
