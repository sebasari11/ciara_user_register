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
  _id: string;
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

export interface ActividadAlternativa {
  _id?: string;
  emailUser: string;
  respuestaConsultaGemini: string;
  horaActual: string | Date;
  promptConsultaGemini: string;
}

export interface UserPreferences {
  _id?: string;
  email: string;
  periodo: string;
  horarioClases: string;
  mascota: string;
  responsabilidadesEnCasa: string;
  espacioOrdenado: string;
  actividadesAireLibre: string;
  actividadesEnCasa: string;
  motivacion: string;
}

export interface UserProfileGeminis {
  _id?: string;
  email: string;
  respuestaGemini?: string;
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

  async deleteUserRegister(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/user-register/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al eliminar usuario" };
      }
      
      return { success: true };
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

  async deleteReporte(id: string, adminPwd: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/reportes/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ adminPwd })
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al eliminar reporte" };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  // Actividades Alternativas methods
  async loadActividadesAlternativas(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ success: boolean; actividades?: ActividadAlternativa[]; pagination?: PaginationInfo; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE}/actividades-alternativas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const res = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al cargar actividades alternativas" };
      }
      
      return { 
        success: true, 
        actividades: data.items || data,
        pagination: data.pagination
      };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  // User Preferences methods
  async loadUserPreferences(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ success: boolean; preferences?: UserPreferences[]; pagination?: PaginationInfo; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE}/user-preferences${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const res = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al cargar preferencias de usuario" };
      }
      
      return { 
        success: true, 
        preferences: data.items || data,
        pagination: data.pagination
      };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  // User Profile Geminis methods
  async loadUserProfileGeminis(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ success: boolean; profiles?: UserProfileGeminis[]; pagination?: PaginationInfo; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE}/user-profile-geminis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const res = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al cargar perfiles de Gemini" };
      }
      
      return { 
        success: true, 
        profiles: data.items || data,
        pagination: data.pagination
      };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  async createUserProfileGeminis(profile: { email: string; respuestaGemini?: string }): Promise<{ success: boolean; profile?: UserProfileGeminis; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/user-profile-geminis`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al crear perfil de Gemini" };
      }
      
      return { success: true, profile: data };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }

  async deleteUserProfileGeminis(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/user-profile-geminis/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al eliminar perfil de Gemini" };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }
}

export const apiClient = new ApiClient();

