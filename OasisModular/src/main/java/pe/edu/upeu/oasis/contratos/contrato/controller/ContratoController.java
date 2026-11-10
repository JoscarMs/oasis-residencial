package pe.edu.upeu.oasis.contratos.contrato.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoRequest;
import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoResponse;
import pe.edu.upeu.oasis.contratos.contrato.service.ContratoService;

import java.util.List;

@Tag(name = "Contratos - Orquestación Cabecera-Detalle (Ronald Alex Solorzano)")
@RestController
@RequestMapping("/api/v1/contratos")
@RequiredArgsConstructor
public class ContratoController {
    private final ContratoService service;

    @Operation(summary = "Lista todos los contratos formalizados con filtros opcionales de estado y fecha")
    @GetMapping
    public ResponseEntity<List<ContratoResponse>> listar(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate desde,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate hasta) {
        return ResponseEntity.ok(service.listar(estado, desde, hasta));
    }

    @Operation(summary = "Obtiene un contrato por ID con su desglose de cuotas")
    @GetMapping("/{id}")
    public ResponseEntity<ContratoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtener(id));
    }

    @Operation(summary = "Formaliza un nuevo contrato con bloqueo atómico de habitación")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContratoResponse formalizar(@Valid @RequestBody ContratoRequest request) {
        return service.formalizarContrato(request);
    }

    @Operation(summary = "Anula un contrato y libera la habitación")
    @PatchMapping("/{id}/anular")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void anularPatch(@PathVariable Long id) {
        service.anularContrato(id);
    }

    @Operation(summary = "Anula un contrato y libera la habitación (DELETE)")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void anular(@PathVariable Long id) {
        service.anularContrato(id);
    }
}
