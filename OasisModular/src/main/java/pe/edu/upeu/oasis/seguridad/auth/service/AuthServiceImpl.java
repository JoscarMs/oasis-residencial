package pe.edu.upeu.oasis.seguridad.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pe.edu.upeu.oasis.seguridad.auth.dto.LoginRequest;
import pe.edu.upeu.oasis.seguridad.auth.dto.LoginResponse;
import pe.edu.upeu.oasis.seguridad.auth.dto.RegistroRequest;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.CuentaUsuario;
import pe.edu.upeu.oasis.seguridad.cuenta.repository.CuentaUsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CuentaUsuarioRepository cuentaUsuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(LoginRequest request) {
        CuentaUsuario usuario = cuentaUsuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        boolean passwordValida = passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())
                || request.getPassword().equals(usuario.getPasswordHash());

        if (!passwordValida) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        usuario.setUltimoAcceso(LocalDateTime.now());
        cuentaUsuarioRepository.save(usuario);

        String token = jwtService.generarToken(usuario);
        String rolLimpio = usuario.getRol() != null ? usuario.getRol().replace("ROLE_", "") : "RESIDENTE";

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpiracionSegundos())
                .username(usuario.getUsername())
                .roles(List.of(rolLimpio))
                .build();
    }

    @Override
    public LoginResponse registrar(RegistroRequest request) {
        if (cuentaUsuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El nombre de usuario ya se encuentra registrado");
        }

        String rol = request.getRol() != null && !request.getRol().isBlank() ? request.getRol() : "RESIDENTE";
        CuentaUsuario nuevo = CuentaUsuario.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol(rol.startsWith("ROLE_") ? rol : "ROLE_" + rol)
                .huespedId(request.getHuespedId())
                .activo(true)
                .ultimoAcceso(LocalDateTime.now())
                .build();

        cuentaUsuarioRepository.save(nuevo);
        String token = jwtService.generarToken(nuevo);
        String rolLimpio = rol.replace("ROLE_", "");

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpiracionSegundos())
                .username(nuevo.getUsername())
                .roles(List.of(rolLimpio))
                .build();
    }

    @Override
    public void cambiarPassword(String username, pe.edu.upeu.oasis.seguridad.auth.dto.CambiarPasswordRequest request) {
        CuentaUsuario usuario = cuentaUsuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        boolean actualValida = passwordEncoder.matches(request.getPasswordActual(), usuario.getPasswordHash())
                || request.getPasswordActual().equals(usuario.getPasswordHash());

        if (!actualValida) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña actual es incorrecta");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.getPasswordNueva()));
        usuario.setPasswordInicial(null); // Deja de usar la contraseña inicial por defecto
        cuentaUsuarioRepository.save(usuario);
    }
}
