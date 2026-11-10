package pe.edu.upeu.oasis.pagos.pago.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.pagos.pago.dto.ServicioExtraDTO;
import pe.edu.upeu.oasis.pagos.pago.service.ServicioExtraService;

import java.util.List;

@Tag(name = "Servicios Extras - Catálogo Residencial")
@RestController
@RequestMapping("/api/v1/servicios-extras")
@RequiredArgsConstructor
public class ServicioExtraController {
    private final ServicioExtraService service;

    @Operation(summary = "Lista todos los servicios extras activos disponibles para compra")
    @GetMapping
    public ResponseEntity<List<ServicioExtraDTO>> listarActivos() {
        return ResponseEntity.ok(service.listarActivos());
    }

    @Operation(summary = "Lista todos los servicios extras (incluyendo inactivos, para admin)")
    @GetMapping("/todos")
    public ResponseEntity<List<ServicioExtraDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(summary = "Obtiene un servicio extra por ID")
    @GetMapping("/{id}")
    public ResponseEntity<ServicioExtraDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @Operation(summary = "Crea un nuevo servicio extra en el catálogo (ADMIN/SUPERVISOR)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServicioExtraDTO crear(@Valid @RequestBody ServicioExtraDTO dto) {
        return service.crear(dto);
    }

    @Operation(summary = "Actualiza un servicio extra existente (ADMIN/SUPERVISOR)")
    @PutMapping("/{id}")
    public ResponseEntity<ServicioExtraDTO> actualizar(@PathVariable Long id, @Valid @RequestBody ServicioExtraDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @Operation(summary = "Elimina un servicio extra del catálogo (ADMIN)")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
