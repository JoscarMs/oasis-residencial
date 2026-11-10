package pe.edu.upeu.oasis.seguridad.cuenta.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioRequest;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioResponse;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.RegistroAuditoria;
import pe.edu.upeu.oasis.seguridad.cuenta.service.CuentaUsuarioService;

import java.util.List;

@Tag(name = "Seguridad & Auditoría (Ronald Alex Solorzano)")
@RestController
@RequestMapping("/api/v1/cuentas")
@RequiredArgsConstructor
public class CuentaUsuarioController {
    private final CuentaUsuarioService service;

    @Operation(summary = "Lista todas las cuentas de usuario registradas")
    @GetMapping
    public ResponseEntity<List<CuentaUsuarioResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @Operation(summary = "Obtiene una cuenta de usuario por ID")
    @GetMapping("/{id}")
    public ResponseEntity<CuentaUsuarioResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @Operation(summary = "Registra una nueva cuenta de usuario")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CuentaUsuarioResponse crear(@Valid @RequestBody CuentaUsuarioRequest request) {
        return service.crear(request);
    }

    @Operation(summary = "Desactiva una cuenta de usuario")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable Long id) {
        service.desactivar(id);
    }

    @Operation(summary = "Alterna el estado activo/inactivo de una cuenta")
    @PatchMapping("/{id}/toggle-activo")
    public ResponseEntity<Void> toggleActivo(@PathVariable Long id) {
        service.toggleActivo(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Restablece la contraseña a la clave base 123456 (Exclusivo Administrador)")
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<CuentaUsuarioResponse> resetPassword(@PathVariable Long id) {
        return ResponseEntity.ok(service.resetPassword(id));
    }

    @Operation(summary = "Consulta los últimos eventos de auditoría registrados (MDC / Correlation ID)")
    @GetMapping("/auditoria")
    public ResponseEntity<List<RegistroAuditoria>> listarAuditoria() {
        return ResponseEntity.ok(service.listarAuditoriaReciente());
    }
}
