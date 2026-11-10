export interface Huesped {
  id?: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  perfil: string;
  esMenorDeEdad: boolean;
  nombreApoderado?: string;
  telefonoApoderado?: string;
  dniApoderado?: string;
  parentesco?: string;
}

export interface HuespedRequest {
  nombreCompleto: string;
  email: string;
  telefono?: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  perfil?: string;
  esMenorDeEdad?: boolean;
  nombreApoderado?: string;
  telefonoApoderado?: string;
  dniApoderado?: string;
  parentesco?: string;
}
