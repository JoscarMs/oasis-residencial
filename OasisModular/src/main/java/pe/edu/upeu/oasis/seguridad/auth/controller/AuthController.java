package pe.edu.upeu.oasis.seguridad.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.seguridad.auth.dto.LoginRequest;
import pe.edu.upeu.oasis.seguridad.auth.dto.LoginResponse;
import pe.edu.upeu.oasis.seguridad.auth.dto.PerfilResponse;
import pe.edu.upeu.oasis.seguridad.auth.dto.RegistroRequest;
import pe.edu.upeu.oasis.seguridad.auth.service.AuthService;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Tag(name = "Autenticación JWT & Perfil (S10)")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Inicio de sesión y emisión de JWT firmado con RS256")
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @Operation(summary = "Registro de nuevo usuario")
    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponse registro(@Valid @RequestBody RegistroRequest request) {
        return authService.registrar(request);
    }

    @Operation(summary = "Consulta el perfil del usuario autenticado leyendo directamente del Jwt")
    @GetMapping("/perfil")
    public PerfilResponse perfil(@AuthenticationPrincipal Jwt jwt) {
        String sub = jwt != null ? jwt.getSubject() : "anónimo";
        String username = jwt != null ? jwt.getClaimAsString("preferred_username") : "anónimo";
        String email = jwt != null ? jwt.getClaimAsString("email") : "";

        List<String> roles = List.of();
        if (jwt != null) {
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null && realmAccess.get("roles") instanceof Collection<?> lista) {
                roles = lista.stream().map(Object::toString).toList();
            }
        }

        return PerfilResponse.builder()
                .sub(sub)
                .username(username)
                .email(email)
                .roles(roles)
                .build();
    }

    @Operation(summary = "Cambio de contraseña por el propio usuario autenticado")
    @PostMapping("/cambiar-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cambiarPassword(@AuthenticationPrincipal Jwt jwt,
                                @Valid @RequestBody pe.edu.upeu.oasis.seguridad.auth.dto.CambiarPasswordRequest request) {
        String username = jwt != null ? jwt.getClaimAsString("preferred_username") : null;
        if (username == null && jwt != null) {
            username = jwt.getSubject();
        }
        if (username == null || username.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no identificada");
        }
        authService.cambiarPassword(username, request);
    }
}
