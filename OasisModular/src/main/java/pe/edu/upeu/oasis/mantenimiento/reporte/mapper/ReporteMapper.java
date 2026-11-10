package pe.edu.upeu.oasis.mantenimiento.reporte.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pe.edu.upeu.oasis.mantenimiento.reporte.dto.ReporteRequest;
import pe.edu.upeu.oasis.mantenimiento.reporte.dto.ReporteResponse;
import pe.edu.upeu.oasis.mantenimiento.reporte.entity.ReporteMantenimiento;

@Mapper(componentModel = "spring")
public interface ReporteMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "fechaReporte", ignore = true)
    ReporteMantenimiento toEntity(ReporteRequest request);

    ReporteResponse toResponse(ReporteMantenimiento entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "fechaReporte", ignore = true)
    void updateEntityFromRequest(ReporteRequest request, @MappingTarget ReporteMantenimiento entity);
}