import { Habitacion } from './habitacion.model';

export const SEED_HABITACIONES: Habitacion[] = [
  // Piso 1
  { id: 1, numero: '101', piso: 1, precio: 350, estado: 'DISPONIBLE', tipoHabitacionId: 1, tipoHabitacionNombre: 'Habitación Normal', amoblada: true, tipoBano: 'COMPARTIDO' },
  { id: 2, numero: '102', piso: 1, precio: 350, estado: 'DISPONIBLE', tipoHabitacionId: 1, tipoHabitacionNombre: 'Habitación Normal', amoblada: false, tipoBano: 'COMPARTIDO' },
  { id: 3, numero: '103', piso: 1, precio: 600, estado: 'DISPONIBLE', tipoHabitacionId: 2, tipoHabitacionNombre: 'Minidepartamento', amoblada: true, tipoBano: 'PRIVADO' },
  { id: 4, numero: '104', piso: 1, precio: 600, estado: 'DISPONIBLE', tipoHabitacionId: 2, tipoHabitacionNombre: 'Minidepartamento', amoblada: true, tipoBano: 'PRIVADO' },
  { id: 5, numero: '105', piso: 1, precio: 900, estado: 'DISPONIBLE', tipoHabitacionId: 3, tipoHabitacionNombre: 'Departamento', amoblada: false, tipoBano: 'PRIVADO' },
  { id: 6, numero: '106', piso: 1, precio: 900, estado: 'DISPONIBLE', tipoHabitacionId: 3, tipoHabitacionNombre: 'Departamento', amoblada: true, tipoBano: 'PRIVADO' },

  // Piso 2
  { id: 7, numero: '201', piso: 2, precio: 350, estado: 'DISPONIBLE', tipoHabitacionId: 1, tipoHabitacionNombre: 'Habitación Normal', amoblada: true, tipoBano: 'COMPARTIDO' },
  { id: 8, numero: '202', piso: 2, precio: 350, estado: 'DISPONIBLE', tipoHabitacionId: 1, tipoHabitacionNombre: 'Habitación Normal', amoblada: false, tipoBano: 'COMPARTIDO' },
  { id: 9, numero: '203', piso: 2, precio: 600, estado: 'DISPONIBLE', tipoHabitacionId: 2, tipoHabitacionNombre: 'Minidepartamento', amoblada: true, tipoBano: 'PRIVADO' },
  { id: 10, numero: '204', piso: 2, precio: 600, estado: 'DISPONIBLE', tipoHabitacionId: 2, tipoHabitacionNombre: 'Minidepartamento', amoblada: true, tipoBano: 'PRIVADO' },
  { id: 11, numero: '205', piso: 2, precio: 900, estado: 'DISPONIBLE', tipoHabitacionId: 3, tipoHabitacionNombre: 'Departamento', amoblada: false, tipoBano: 'PRIVADO' },
  { id: 12, numero: '206', piso: 2, precio: 900, estado: 'DISPONIBLE', tipoHabitacionId: 3, tipoHabitacionNombre: 'Departamento', amoblada: true, tipoBano: 'PRIVADO' },

  // Piso 3
  { id: 13, numero: '301', piso: 3, precio: 350, estado: 'DISPONIBLE', tipoHabitacionId: 1, tipoHabitacionNombre: 'Habitación Normal', amoblada: true, tipoBano: 'COMPARTIDO' },
  { id: 14, numero: '302', piso: 3, precio: 350, estado: 'DISPONIBLE', tipoHabitacionId: 1, tipoHabitacionNombre: 'Habitación Normal', amoblada: false, tipoBano: 'COMPARTIDO' },
  { id: 15, numero: '303', piso: 3, precio: 600, estado: 'DISPONIBLE', tipoHabitacionId: 2, tipoHabitacionNombre: 'Minidepartamento', amoblada: true, tipoBano: 'PRIVADO' },
  { id: 16, numero: '304', piso: 3, precio: 600, estado: 'DISPONIBLE', tipoHabitacionId: 2, tipoHabitacionNombre: 'Minidepartamento', amoblada: true, tipoBano: 'PRIVADO' },
  { id: 17, numero: '305', piso: 3, precio: 900, estado: 'DISPONIBLE', tipoHabitacionId: 3, tipoHabitacionNombre: 'Departamento', amoblada: false, tipoBano: 'PRIVADO' },
  { id: 18, numero: '306', piso: 3, precio: 900, estado: 'DISPONIBLE', tipoHabitacionId: 3, tipoHabitacionNombre: 'Departamento', amoblada: true, tipoBano: 'PRIVADO' },

  // Piso 4
  { id: 19, numero: '401', piso: 4, precio: 350, estado: 'DISPONIBLE', tipoHabitacionId: 1, tipoHabitacionNombre: 'Habitación Normal', amoblada: true, tipoBano: 'COMPARTIDO' },
  { id: 20, numero: '402', piso: 4, precio: 350, estado: 'DISPONIBLE', tipoHabitacionId: 1, tipoHabitacionNombre: 'Habitación Normal', amoblada: false, tipoBano: 'COMPARTIDO' },
  { id: 21, numero: '403', piso: 4, precio: 600, estado: 'DISPONIBLE', tipoHabitacionId: 2, tipoHabitacionNombre: 'Minidepartamento', amoblada: true, tipoBano: 'PRIVADO' },
  { id: 22, numero: '404', piso: 4, precio: 600, estado: 'DISPONIBLE', tipoHabitacionId: 2, tipoHabitacionNombre: 'Minidepartamento', amoblada: true, tipoBano: 'PRIVADO' },
  { id: 23, numero: '405', piso: 4, precio: 900, estado: 'DISPONIBLE', tipoHabitacionId: 3, tipoHabitacionNombre: 'Departamento', amoblada: false, tipoBano: 'PRIVADO' },
  { id: 24, numero: '406', piso: 4, precio: 900, estado: 'DISPONIBLE', tipoHabitacionId: 3, tipoHabitacionNombre: 'Departamento', amoblada: true, tipoBano: 'PRIVADO' },
];
