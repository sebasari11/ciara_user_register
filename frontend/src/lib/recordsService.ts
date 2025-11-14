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

export interface UserRegistersResult {
  success: boolean;
  registers?: UserRegister[];
  error?: string;
}

export interface SaveUserRegisterResult {
  success: boolean;
  register?: UserRegister;
  error?: string;
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

  async loadUserRegisters(): Promise<UserRegistersResult> {
    try {
      const res = await fetch(`${API_BASE}/user-register`, {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || "Error al listar" };
      }
      
      return { success: true, registers: data };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }
}

export const userRegisterService = new UserRegisterService();

