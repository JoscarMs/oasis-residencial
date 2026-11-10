package pe.edu.upeu.oasis.alojamiento.tipohabitacion.mapper;

import org.mapstruct.*;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto.TipoHabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto.TipoHabitacionResponse;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.entity.TipoHabitacion;

@Mapper(componentModel = "spring")
public interface TipoHabitacionMapper {
    TipoHabitacion toEntity(TipoHabitacionRequest request);
    TipoHabitacionResponse toResponse(TipoHabitacion entity);
    void updateEntityFromRequest(TipoHabitacionRequest request, @MappingTarget TipoHabitacion entity);
}
