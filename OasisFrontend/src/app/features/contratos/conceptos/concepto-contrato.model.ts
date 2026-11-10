export interface ConceptoContrato {
  id?: number;
  nombre: string;
  descripcion?: string;
  precioSugerido: number;
  categoria?: string; // GARANTIA, SERVICIO, COCHERA, EQUIPAMIENTO, OTRO
  icono?: string; // 🛡️, 🌐, 🚗, 🧊, ♨️, 🧹, 📦
  activo?: boolean;
}
