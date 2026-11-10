export interface Habitacion {
  id?: number;
  numero: string;
  piso: number;
  precio: number;
  estado: string;
  tipoHabitacionId: number;
  tipoHabitacionNombre?: string;
  amoblada?: boolean;
  tipoBano?: string; // 'PRIVADO' | 'COMPARTIDO'
}

export interface HabitacionRequest {
  numero: string;
  piso: number;
  precio: number;
  estado: string;
  tipoHabitacionId: number;
  amoblada: boolean;
  tipoBano: string;
}
