package pe.edu.upeu.oasis.contratos.contrato.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.contratos.contrato.dto.ConceptoContratoDTO;
import pe.edu.upeu.oasis.contratos.contrato.service.ConceptoContratoService;

import java.util.List;

@Tag(name = "Contratos - Conceptos y Plantillas de Cobro")
@RestController
@RequestMapping("/api/v1/conceptos-contrato")
@RequiredArgsConstructor
public class ConceptoContratoController {
    private final ConceptoContratoService service;

    @Operation(summary = "Lista todos los conceptos de contrato activos disponibles para agregar al pago")
    @GetMapping
    public ResponseEntity<List<ConceptoContratoDTO>> listarActivos() {
        return ResponseEntity.ok(service.listarActivos());
    }

    @Operation(summary = "Lista todos los conceptos de contrato (para administración)")
    @GetMapping("/todos")
    public ResponseEntity<List<ConceptoContratoDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(summary = "Crea un nuevo concepto de contrato (ADMIN/SUPERVISOR)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConceptoContratoDTO crear(@Valid @RequestBody ConceptoContratoDTO dto) {
        return service.crear(dto);
    }

    @Operation(summary = "Actualiza un concepto de contrato (ADMIN/SUPERVISOR)")
    @PutMapping("/{id}")
    public ResponseEntity<ConceptoContratoDTO> actualizar(@PathVariable Long id, @Valid @RequestBody ConceptoContratoDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @Operation(summary = "Elimina un concepto de contrato (ADMIN)")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
