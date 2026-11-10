package pe.edu.upeu.oasis.alojamiento.tipohabitacion.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto.TipoHabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto.TipoHabitacionResponse;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.service.TipoHabitacionService;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Tag(name = "Alojamiento - Tipos de Habitación (José Carlos Mena)")
@RestController
@RequestMapping("/api/v1/tipos-habitacion")
@RequiredArgsConstructor
public class TipoHabitacionController {
    private final TipoHabitacionService service;

    @Operation(summary = "Lista todos los tipos de habitación con Cache-Control")
    @GetMapping
    public ResponseEntity<List<TipoHabitacionResponse>> listar() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).cachePublic())
                .body(service.listar());
    }

    @Operation(summary = "Obtiene un tipo de habitación por ID")
    @GetMapping("/{id}")
    public ResponseEntity<TipoHabitacionResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @Operation(summary = "Registra un nuevo tipo de habitación")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoHabitacionResponse crear(@Valid @RequestBody TipoHabitacionRequest request) {
        return service.crear(request);
    }

    @Operation(summary = "Actualiza un tipo de habitación existente")
    @PutMapping("/{id}")
    public ResponseEntity<TipoHabitacionResponse> actualizar(@PathVariable Long id, @Valid @RequestBody TipoHabitacionRequest request) {
        return ResponseEntity.ok(service.actualizar(id, request));
    }

    @Operation(summary = "Elimina un tipo de habitación")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
