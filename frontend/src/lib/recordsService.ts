/**
 * User Register service
 * Handles CRUD operations for user registers
 */

import { authService } from './authService';

const API_BASE = import.meta.env.PUBLIC_API_BASE || "http://localhost:4000/api";

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

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserRegistersResult {
  success: boolean;
  registers?: UserRegister[];
  pagination?: PaginationInfo;
  error?: string;
}

export interface SaveUserRegisterResult {
  success: boolean;
  register?: UserRegister;
  error?: string;
}

export interface CheckEmailResult {
  success: boolean;
  exists?: boolean;
  error?: string;
}

export interface ListUserRegistersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class UserRegisterService {
  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async saveUserRegister(register: Omit<UserRegister, '_id' | 'createdAt' | 'updatedAt'>): Promise<SaveUserRegisterResult> {
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

  async loadUserRegisters(params?: ListUserRegistersParams): Promise<UserRegistersResult> {
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

  async checkEmailExists(email: string): Promise<CheckEmailResult> {
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
}

export const userRegisterService = new UserRegisterService();

