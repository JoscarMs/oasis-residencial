package pe.edu.upeu.oasis.alojamiento.habitacion.service;

import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionResponse;
import java.util.List;

public interface HabitacionService {
    List<HabitacionResponse> listar();
    List<HabitacionResponse> listar(Long tipoHabitacionId);
    List<HabitacionResponse> listarDisponibles();
    HabitacionResponse obtener(Long id);
    HabitacionResponse crear(HabitacionRequest request);
    HabitacionResponse actualizar(Long id, HabitacionRequest request);
    void eliminar(Long id);
    void bloquearHabitacion(Long id);
    void liberarHabitacion(Long id);
}
