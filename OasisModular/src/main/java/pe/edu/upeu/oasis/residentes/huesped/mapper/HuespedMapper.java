package pe.edu.upeu.oasis.residentes.huesped.mapper;

import org.mapstruct.*;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedRequest;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedResponse;
import pe.edu.upeu.oasis.residentes.huesped.entity.ContactoApoderado;
import pe.edu.upeu.oasis.residentes.huesped.entity.Huesped;

@Mapper(componentModel = "spring")
public interface HuespedMapper {
    @Mapping(target = "apoderado", expression = "java(mapApoderado(request))")
    Huesped toEntity(HuespedRequest request);

    @Mapping(target = "nombreApoderado", source = "apoderado.nombreApoderado")
    @Mapping(target = "telefonoApoderado", source = "apoderado.telefonoApoderado")
    @Mapping(target = "dniApoderado", source = "apoderado.dniApoderado")
    @Mapping(target = "parentesco", source = "apoderado.parentesco")
    HuespedResponse toResponse(Huesped entity);

    @Mapping(target = "apoderado", expression = "java(mapApoderado(request))")
    void updateEntityFromRequest(HuespedRequest request, @MappingTarget Huesped entity);

    default ContactoApoderado mapApoderado(HuespedRequest request) {
        if (Boolean.TRUE.equals(request.getEsMenorDeEdad()) || request.getNombreApoderado() != null) {
            return ContactoApoderado.builder()
                    .nombreApoderado(request.getNombreApoderado())
                    .telefonoApoderado(request.getTelefonoApoderado())
                    .dniApoderado(request.getDniApoderado())
                    .parentesco(request.getParentesco())
                    .build();
        }
        return null;
    }
}
