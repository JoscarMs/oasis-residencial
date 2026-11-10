package pe.edu.upeu.oasis;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "Health & Baseline")
@RestController
@RequestMapping("/api/v1")
public class HelloController {

    @Operation(summary = "Endpoint de comprobación del sistema")
    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of(
                "status", "UP",
                "message", "Backend Modular OASIS funcionando correctamente",
                "version", "v1"
        );
    }
}
