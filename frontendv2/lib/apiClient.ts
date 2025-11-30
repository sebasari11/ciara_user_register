/**
 * API Client
 * Centralized API client for backend communication
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: { name: string; email: string; id?: string };
  error?: string;
}

export interface UserRegister {
  _id?: string;
  email: string;
  cedula: string;
  edad: number;
  genero: string;
  so: string;
  movilidad: string;
  tiempoDiario: string;
  universidad: string;
  carrera: string;
  telefono: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reporte {
  _id?: string;
  email: string;
  fecha: string | Date;
  mayorConsumo: string;
  packageName1: string;
  tiempoUso1: number;
  packageName2: string;
  tiempoUso2: number;
  packageName3: string;
  tiempoUso3: number;
  packageName4: string;
  tiempoUso4: number;
  packageName5: string;
  tiempoUso5: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Auth methods
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
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", data.token);
      }
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
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", data.token);
      }
      return { success: true, token: data.token, user: data.user };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // User Register methods
  async saveUserRegister(register: Omit<UserRegister, '_id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; register?: UserRegister; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/user-register`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(register)
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al guardar" };
      }
      
      return { success: true, register: data };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  async loadUserRegisters(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ success: boolean; registers?: UserRegister[]; pagination?: PaginationInfo; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE}/user-register${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const res = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al listar" };
      }
      
      return { 
        success: true, 
        registers: data.items || data,
        pagination: data.pagination
      };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  async checkEmailExists(email: string): Promise<{ success: boolean; exists?: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/user-register/check-email?email=${encodeURIComponent(email)}`, {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al verificar email" };
      }
      
      return { success: true, exists: data.exists };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  // Reportes methods
  async loadReportes(params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; reportes?: Reporte[]; pagination?: PaginationInfo; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE}/reportes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const res = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al cargar reportes" };
      }
      
      return { 
        success: true, 
        reportes: data.items || data,
        pagination: data.pagination
      };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }
}

export const apiClient = new ApiClient();

