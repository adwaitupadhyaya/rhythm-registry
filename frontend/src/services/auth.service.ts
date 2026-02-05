import { http } from "./http";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "@/types";

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>(
      "/api/auth/login",
      credentials,
    );

    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    window.dispatchEvent(
      new CustomEvent("auth:login", { detail: { user: response.user } }),
    );

    return response;
  }

  async register(data: RegisterRequest): Promise<void> {
    await http.post("/api/auth/register", data);
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("auth:logout"));
    window.location.href = "/";
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
