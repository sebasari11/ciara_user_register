/**
 * Authentication service
 * Handles login, registration, and token management
 */

const API_BASE = import.meta.env.PUBLIC_API_BASE || "http://localhost:4000/api";

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: { name: string; email: string };
  error?: string;
}

class AuthService {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem("token", token);
  }

  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("token");
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Login falló" };
      }
      
      this.setToken(data.token);
      return { success: true, token: data.token, user: data.user };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "No se pudo registrar" };
      }
      
      this.setToken(data.token);
      return { success: true, token: data.token, user: data.user };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

