export interface ServicioExtra {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  icono?: string;
  unidad?: string; // Carga, Mes, Sesión, Bidón, Pack...
  precio: number;
  activo?: boolean;
}

export interface CompraServicio {
  id?: number;
  servicioId: number;
  servicioNombre?: string;
  usuarioId?: string;
  huespedNombre: string;
  habitacionNumero: string;
  cantidad: number;
  precioUnitario?: number;
  total?: number;
  fechaSolicitud?: string;
  notas?: string;
  estado?: 'PENDIENTE' | 'EN_PROCESO' | 'ENTREGADO' | 'CANCELADO' | string;
}
