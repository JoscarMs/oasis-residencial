package pe.edu.upeu.oasis.seguridad.cuenta.service;

import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioRequest;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioResponse;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.RegistroAuditoria;

import java.util.List;

public interface CuentaUsuarioService {
    List<CuentaUsuarioResponse> listar();
    CuentaUsuarioResponse obtener(Long id);
    CuentaUsuarioResponse crear(CuentaUsuarioRequest request);
    void desactivar(Long id);
    void toggleActivo(Long id);
    CuentaUsuarioResponse resetPassword(Long id);
    List<RegistroAuditoria> listarAuditoriaReciente();
}
