export interface Pago {
  id?: number;
  contratoId: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estado: string;
  numeroComprobante: string;
  usuarioId?: string;
}

export interface PagoRequest {
  contratoId: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estado: string;
  numeroComprobante: string;
}

export interface ReporteIngresos {
  anio: number;
  mes: number;
  periodo: string;
  totalRecaudado: number;
  cantidadPagos: number;
  generadoPorRol: string;
}
