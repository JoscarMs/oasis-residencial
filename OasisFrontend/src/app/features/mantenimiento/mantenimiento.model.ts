export interface ReporteMantenimiento {
  id?: number;
  huespedId: number;
  habitacionId: number;
  tipoAveria: string;
  descripcion: string;
  estado: string; // PENDIENTE, EN_PROCESO, SOLUCIONADO
  fechaReporte?: string;
}

export interface ReporteMantenimientoRequest {
  huespedId: number;
  habitacionId: number;
  tipoAveria: string;
  descripcion: string;
}
