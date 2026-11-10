package pe.edu.upeu.oasis.seguridad.cuenta.mapper;

import org.mapstruct.*;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioRequest;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioResponse;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.CuentaUsuario;

@Mapper(componentModel = "spring")
public interface CuentaUsuarioMapper {
    @Mapping(target = "passwordHash", source = "password")
    CuentaUsuario toEntity(CuentaUsuarioRequest request);

    CuentaUsuarioResponse toResponse(CuentaUsuario entity);
}
