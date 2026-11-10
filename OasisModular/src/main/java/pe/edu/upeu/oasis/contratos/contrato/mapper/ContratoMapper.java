package pe.edu.upeu.oasis.contratos.contrato.mapper;

import org.mapstruct.*;
import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoResponse;
import pe.edu.upeu.oasis.contratos.contrato.dto.DetalleContratoDTO;
import pe.edu.upeu.oasis.contratos.contrato.entity.ContratoResidencia;
import pe.edu.upeu.oasis.contratos.contrato.entity.DetalleContrato;

@Mapper(componentModel = "spring")
public interface ContratoMapper {
    ContratoResponse toResponse(ContratoResidencia entity);
    DetalleContratoDTO toDetalleDTO(DetalleContrato entity);
}
