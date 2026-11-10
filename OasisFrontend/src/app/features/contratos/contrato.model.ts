export interface DetalleContrato {
  id?: number;
  concepto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Contrato {
  id?: number;
  codigoContrato: string;
  huespedId: number;
  huespedNombre?: string;
  huespedDni?: string;
  habitacionId: number;
  habitacionNumero?: string;
  habitacionTipo?: string;
  habitacionPrecio?: number;
  tipoContratoId?: number;
  tipoContratoNombre?: string;
  fechaInicio: string;
  fechaFin: string;
  totalContrato: number;
  estado: string; // 'VIGENTE' | 'ANULADO'
  detalles: DetalleContrato[];
}

export interface DetalleContratoRequest {
  concepto: string;
  cantidad: number;
  precioUnitario: number;
}

export interface ContratoRequest {
  huespedId: number;
  habitacionId: number;
  tipoContratoId?: number;
  fechaInicio: string;
  fechaFin: string;
  detalles: DetalleContratoRequest[];
}
