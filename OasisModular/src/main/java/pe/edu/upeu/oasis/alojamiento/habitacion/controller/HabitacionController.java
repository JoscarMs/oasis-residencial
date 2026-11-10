package pe.edu.upeu.oasis.alojamiento.habitacion.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionResponse;
import pe.edu.upeu.oasis.alojamiento.habitacion.service.HabitacionService;

import java.util.List;

@Tag(name = "Alojamiento - Habitaciones (José Carlos Mena)")
@RestController
@RequestMapping("/api/v1/habitaciones")
@RequiredArgsConstructor
public class HabitacionController {
    private final HabitacionService service;

    @Operation(summary = "Lista todas las habitaciones con filtro opcional por tipo de habitación")
    @GetMapping
    public ResponseEntity<List<HabitacionResponse>> listar(@RequestParam(required = false) Long tipoHabitacionId) {
        return ResponseEntity.ok(service.listar(tipoHabitacionId));
    }

    @Operation(summary = "Lista únicamente las habitaciones disponibles")
    @GetMapping("/disponibles")
    public ResponseEntity<List<HabitacionResponse>> listarDisponibles() {
        return ResponseEntity.ok(service.listarDisponibles());
    }

    @Operation(summary = "Obtiene una habitación por ID")
    @GetMapping("/{id}")
    public ResponseEntity<HabitacionResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @Operation(summary = "Registra una nueva habitación")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HabitacionResponse crear(@Valid @RequestBody HabitacionRequest request) {
        return service.crear(request);
    }

    @Operation(summary = "Actualiza una habitación existente")
    @PutMapping("/{id}")
    public ResponseEntity<HabitacionResponse> actualizar(@PathVariable Long id, @Valid @RequestBody HabitacionRequest request) {
        return ResponseEntity.ok(service.actualizar(id, request));
    }

    @Operation(summary = "Elimina una habitación")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
