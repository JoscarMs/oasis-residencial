package pe.edu.upeu.oasis.pagos.pago.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.pagos.pago.dto.CompraServicioDTO;
import pe.edu.upeu.oasis.pagos.pago.service.CompraServicioService;

import java.util.List;

@Tag(name = "Compras y Solicitudes de Servicios Extras (Residentes)")
@RestController
@RequestMapping("/api/v1/compras-servicios")
@RequiredArgsConstructor
public class CompraServicioController {
    private final CompraServicioService service;

    @Operation(summary = "Lista compras de servicios (ABAC: admin ve todos, residente ve solo los suyos)")
    @GetMapping
    public ResponseEntity<List<CompraServicioDTO>> listar(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.listar(jwt));
    }

    @Operation(summary = "Registra una compra o solicitud de servicio extra por parte del residente")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CompraServicioDTO crear(@Valid @RequestBody CompraServicioDTO dto, @AuthenticationPrincipal Jwt jwt) {
        return service.crear(dto, jwt);
    }

    @Operation(summary = "Actualiza el estado de una solicitud (PENDIENTE, EN_PROCESO, ENTREGADO, CANCELADO)")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<CompraServicioDTO> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(service.actualizarEstado(id, estado));
    }
}
