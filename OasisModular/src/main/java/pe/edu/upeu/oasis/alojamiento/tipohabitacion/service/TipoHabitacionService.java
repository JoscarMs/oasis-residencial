package pe.edu.upeu.oasis.alojamiento.tipohabitacion.service;

import pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto.TipoHabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto.TipoHabitacionResponse;
import java.util.List;

public interface TipoHabitacionService {
    List<TipoHabitacionResponse> listar();
    TipoHabitacionResponse obtener(Long id);
    TipoHabitacionResponse crear(TipoHabitacionRequest request);
    TipoHabitacionResponse actualizar(Long id, TipoHabitacionRequest request);
    void eliminar(Long id);
}
