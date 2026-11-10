package pe.edu.upeu.oasis.pagos.pago.mapper;

import org.mapstruct.*;
import pe.edu.upeu.oasis.pagos.pago.dto.PagoRequest;
import pe.edu.upeu.oasis.pagos.pago.dto.PagoResponse;
import pe.edu.upeu.oasis.pagos.pago.entity.Pago;

@Mapper(componentModel = "spring")
public interface PagoMapper {
    Pago toEntity(PagoRequest request);
    PagoResponse toResponse(Pago entity);
    void updateEntityFromRequest(PagoRequest request, @MappingTarget Pago entity);
}
