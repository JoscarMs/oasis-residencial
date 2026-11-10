package pe.edu.upeu.oasis.mantenimiento.reporte.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.mantenimiento.reporte.dto.ReporteRequest;
import pe.edu.upeu.oasis.mantenimiento.reporte.dto.ReporteResponse;
import pe.edu.upeu.oasis.mantenimiento.reporte.service.ReporteService;

import java.util.List;

@Tag(name = "Mantenimiento - Reportes de Averías")
@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
public class ReporteController {
    private final ReporteService service;

    @Operation(summary = "Lista todos los reportes de mantenimiento (ADMIN/EMPLEADO)")
    @GetMapping
    public ResponseEntity<List<ReporteResponse>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(summary = "Lista los reportes de un huésped específico")
    @GetMapping("/huesped/{huespedId}")
    public ResponseEntity<List<ReporteResponse>> listarPorHuesped(@PathVariable Long huespedId) {
        return ResponseEntity.ok(service.listarPorHuesped(huespedId));
    }

    @Operation(summary = "Obtiene un reporte por ID")
    @GetMapping("/{id}")
    public ResponseEntity<ReporteResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @Operation(summary = "Crea un nuevo reporte de avería")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReporteResponse crear(@Valid @RequestBody ReporteRequest request) {
        return service.crear(request);
    }

    @Operation(summary = "Actualiza el estado de un reporte (EN_PROCESO, SOLUCIONADO)")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ReporteResponse> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(service.actualizarEstado(id, estado));
    }
}