package pe.edu.upeu.oasis.residentes.huesped.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedRequest;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedResponse;
import pe.edu.upeu.oasis.residentes.huesped.service.HuespedService;

import java.util.List;

@Tag(name = "Residentes - Padrón de Huéspedes (José Carlos Mena)")
@RestController
@RequestMapping("/api/v1/residentes")
@RequiredArgsConstructor
public class HuespedController {
    private final HuespedService service;

    @Operation(summary = "Lista todos los residentes registrados")
    @GetMapping
    public ResponseEntity<List<HuespedResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @Operation(summary = "Obtiene un residente por ID")
    @GetMapping("/{id}")
    public ResponseEntity<HuespedResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @Operation(summary = "Registra un nuevo residente (estudiante, egresado, profesional o familiar)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HuespedResponse crear(@Valid @RequestBody HuespedRequest request) {
        return service.crear(request);
    }

    @Operation(summary = "Actualiza los datos de un residente")
    @PutMapping("/{id}")
    public ResponseEntity<HuespedResponse> actualizar(@PathVariable Long id, @Valid @RequestBody HuespedRequest request) {
        return ResponseEntity.ok(service.actualizar(id, request));
    }

    @Operation(summary = "Elimina un residente del padrón")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
