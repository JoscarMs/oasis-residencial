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
import pe.edu.upeu.oasis.pagos.pago.dto.PagoRequest;
import pe.edu.upeu.oasis.pagos.pago.dto.PagoResponse;
import pe.edu.upeu.oasis.pagos.pago.dto.ReporteIngresosDTO;
import pe.edu.upeu.oasis.pagos.pago.service.PagoService;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Tag(name = "Pagos & Reportes Financieros")
@RestController
@RequestMapping("/api/v1/pagos")
@RequiredArgsConstructor
public class PagoController {
    private final PagoService service;

    @Operation(summary = "Lista los pagos. Si es RESIDENTE, filtra únicamente sus pagos propios; ADMIN y SUPERVISOR ven todos")
    @GetMapping
    public ResponseEntity<List<PagoResponse>> listar(@AuthenticationPrincipal Jwt jwt) {
        String usuarioId = esResidente(jwt) ? jwt.getSubject() : null;
        return ResponseEntity.ok(service.listar(usuarioId));
    }

    @Operation(summary = "Obtiene un pago por ID. Si es RESIDENTE y el pago pertenece a otro usuario, responde 403 Prohibido")
    @GetMapping("/{id}")
    public ResponseEntity<PagoResponse> obtener(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String usuarioId = esResidente(jwt) ? jwt.getSubject() : null;
        return ResponseEntity.ok(service.obtener(id, usuarioId));
    }

    @Operation(summary = "Registra un nuevo pago de cuota o garantía")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PagoResponse registrar(@Valid @RequestBody PagoRequest request, @AuthenticationPrincipal Jwt jwt) {
        String usuarioId = jwt != null ? jwt.getSubject() : null;
        return service.registrarPago(request, usuarioId);
    }

    @Operation(summary = "Lista los pagos asociados a un contrato")
    @GetMapping("/contrato/{contratoId}")
    public ResponseEntity<List<PagoResponse>> listarPorContrato(@PathVariable Long contratoId, @AuthenticationPrincipal Jwt jwt) {
        String usuarioId = esResidente(jwt) ? jwt.getSubject() : null;
        return ResponseEntity.ok(service.listarPorContrato(contratoId, usuarioId));
    }

    @Operation(summary = "Anula un pago registrado")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void anular(@PathVariable Long id) {
        service.anularPago(id);
    }

    @Operation(summary = "Genera reporte mensual de ingresos (Exclusivo ROLE_ADMIN / ROLE_SUPERVISOR)")
    @GetMapping("/reportes/mensual")
    public ResponseEntity<ReporteIngresosDTO> reporteMensual(@RequestParam int anio, @RequestParam int mes) {
        return ResponseEntity.ok(service.generarReporteMensual(anio, mes));
    }

    @Operation(summary = "Genera reporte anual de ingresos (Exclusivo ROLE_ADMIN / ROLE_SUPERVISOR)")
    @GetMapping("/reportes/anual")
    public ResponseEntity<ReporteIngresosDTO> reporteAnual(@RequestParam int anio) {
        return ResponseEntity.ok(service.generarReporteAnual(anio));
    }

    private boolean esResidente(Jwt jwt) {
        if (jwt == null) return false;
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        Object roles = realmAccess == null ? null : realmAccess.get("roles");
        return roles instanceof Collection<?> lista 
                && lista.contains("RESIDENTE") 
                && !lista.contains("ADMIN") 
                && !lista.contains("SUPERVISOR");
    }
}
