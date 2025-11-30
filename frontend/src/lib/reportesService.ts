/**
 * Reportes service
 * Handles fetching reportes data from the backend
 */

import { authService } from './authService';

const API_BASE = import.meta.env.PUBLIC_API_BASE || "http://localhost:4000/api";

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

export interface ReportesResult {
  success: boolean;
  reportes?: Reporte[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface LoadReportesParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ReportesService {
  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async loadReportes(params?: LoadReportesParams): Promise<ReportesResult> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sort', params.sortBy);
      if (params?.sortOrder) queryParams.append('order', params.sortOrder);

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

export const reportesService = new ReportesService();

