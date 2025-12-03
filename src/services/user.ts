import { BASE_PATH } from "../../generated-typescript/base";
import { User } from "../types/auth";

export const userService = {
  async updateProfile(payload: {
    fullName?: string;
    phone?: string;
    address?: string;
    password?: string;
  }): Promise<User> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await fetch(`${BASE_PATH}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const message =
        errorBody?.message || errorBody?.error || "Failed to update profile";
      throw new Error(message);
    }

    const data = (await res.json()) as User;
    return data;
  },
};

export default userService;

