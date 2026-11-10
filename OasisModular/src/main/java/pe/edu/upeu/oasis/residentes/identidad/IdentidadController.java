package pe.edu.upeu.oasis.residentes.identidad;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Residentes - Consulta de identidad (RENIEC/SUNAT)")
@RestController
@RequestMapping("/api/v1/identidad")
@RequiredArgsConstructor
public class IdentidadController {
    private final IdentidadService service;

    @GetMapping("/dni/{dni}")
    public IdentidadResponse dni(@PathVariable String dni) {
        return service.consultarDni(dni);
    }

    @GetMapping("/ruc/{ruc}")
    public IdentidadResponse ruc(@PathVariable String ruc) {
        return service.consultarRuc(ruc);
    }
}
