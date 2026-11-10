package pe.edu.upeu.oasis.contratos.contrato.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.oasis.contratos.contrato.dto.TipoContratoRequest;
import pe.edu.upeu.oasis.contratos.contrato.dto.TipoContratoResponse;
import pe.edu.upeu.oasis.contratos.contrato.service.TipoContratoService;

import java.util.List;

@Tag(name = "Contratos - Tipos de Contrato")
@RestController
@RequestMapping("/api/v1/tipos-contrato")
@RequiredArgsConstructor
public class TipoContratoController {
    private final TipoContratoService service;

    @GetMapping
    public ResponseEntity<List<TipoContratoResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoContratoResponse crear(@Valid @RequestBody TipoContratoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public TipoContratoResponse actualizar(@PathVariable Long id, @Valid @RequestBody TipoContratoRequest request) {
        return service.actualizar(id, request);
    }
}