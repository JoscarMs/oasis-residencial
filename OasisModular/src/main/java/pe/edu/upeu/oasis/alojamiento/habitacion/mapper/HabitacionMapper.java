package pe.edu.upeu.oasis.alojamiento.habitacion.mapper;

import org.mapstruct.*;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionResponse;
import pe.edu.upeu.oasis.alojamiento.habitacion.entity.Habitacion;

@Mapper(componentModel = "spring")
public interface HabitacionMapper {
    @Mapping(target = "tipoHabitacion", ignore = true)
    Habitacion toEntity(HabitacionRequest request);

    @Mapping(target = "tipoHabitacionId", source = "tipoHabitacion.id")
    @Mapping(target = "tipoHabitacionNombre", source = "tipoHabitacion.nombre")
    HabitacionResponse toResponse(Habitacion entity);

    @Mapping(target = "tipoHabitacion", ignore = true)
    void updateEntityFromRequest(HabitacionRequest request, @MappingTarget Habitacion entity);
}
