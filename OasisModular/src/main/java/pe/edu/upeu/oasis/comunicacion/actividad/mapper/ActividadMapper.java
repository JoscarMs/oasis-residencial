package pe.edu.upeu.oasis.comunicacion.actividad.mapper;

import org.mapstruct.*;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadRequest;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadResponse;
import pe.edu.upeu.oasis.comunicacion.actividad.entity.ActividadComunitaria;

@Mapper(componentModel = "spring")
public interface ActividadMapper {
    ActividadComunitaria toEntity(ActividadRequest request);
    ActividadResponse toResponse(ActividadComunitaria entity);
    void updateEntityFromRequest(ActividadRequest request, @MappingTarget ActividadComunitaria entity);
}

