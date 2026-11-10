package pe.edu.upeu.oasis.seguridad.auth.service;

import pe.edu.upeu.oasis.seguridad.auth.dto.LoginRequest;
import pe.edu.upeu.oasis.seguridad.auth.dto.LoginResponse;
import pe.edu.upeu.oasis.seguridad.auth.dto.RegistroRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse registrar(RegistroRequest request);
    void cambiarPassword(String username, pe.edu.upeu.oasis.seguridad.auth.dto.CambiarPasswordRequest request);
}
