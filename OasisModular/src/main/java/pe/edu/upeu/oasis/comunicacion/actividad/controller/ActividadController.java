package pe.edu.upeu.oasis.comunicacion.actividad.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadRequest;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadResponse;
import pe.edu.upeu.oasis.comunicacion.actividad.service.ActividadService;

import java.util.List;

@Tag(name = "ComunicaciÃ³n - Cartelera Oficial (Ronald Alex Solorzano)")
@RestController
@RequestMapping("/api/v1/actividades")
@RequiredArgsConstructor
public class ActividadController {
    private final ActividadService service;

    @Operation(summary = "Lista las actividades y normas activas en la cartelera")
    @GetMapping
    public ResponseEntity<List<ActividadResponse>> listar() {
        return ResponseEntity.ok(service.listarActivos());
    }

    @Operation(summary = "Obtiene una actividad por ID")
    @GetMapping("/{id}")
    public ResponseEntity<ActividadResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @Operation(summary = "Publica una actividad o norma de convivencia (ADMIN)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActividadResponse publicar(@Valid @RequestBody ActividadRequest request) {
        return service.publicar(request);
    }

    @Operation(summary = "Actualiza una actividad comunitario")
    @PutMapping("/{id}")
    public ResponseEntity<ActividadResponse> actualizar(@PathVariable Long id, @Valid @RequestBody ActividadRequest request) {
        return ResponseEntity.ok(service.actualizar(id, request));
    }

    @Operation(summary = "Desactiva o elimina una actividad de la cartelera")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}

