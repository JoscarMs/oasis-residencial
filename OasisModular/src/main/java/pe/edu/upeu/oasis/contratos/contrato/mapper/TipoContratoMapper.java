package pe.edu.upeu.oasis.contratos.contrato.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import pe.edu.upeu.oasis.contratos.contrato.dto.TipoContratoRequest;
import pe.edu.upeu.oasis.contratos.contrato.dto.TipoContratoResponse;
import pe.edu.upeu.oasis.contratos.contrato.entity.TipoContrato;

@Mapper(componentModel = "spring")
public interface TipoContratoMapper {
    @Mapping(target = "id", ignore = true)
    TipoContrato toEntity(TipoContratoRequest request);
    TipoContratoResponse toResponse(TipoContrato entity);
    
    @Mapping(target = "id", ignore = true)
    void updateEntityFromRequest(TipoContratoRequest request, @MappingTarget TipoContrato entity);
}