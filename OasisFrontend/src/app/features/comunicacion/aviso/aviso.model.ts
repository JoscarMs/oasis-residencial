export interface Aviso {
  id?: number;
  titulo: string;
  contenido: string;
  categoria: string;
  fechaPublicacion?: string;
  fijado: boolean;
  activo: boolean;
}