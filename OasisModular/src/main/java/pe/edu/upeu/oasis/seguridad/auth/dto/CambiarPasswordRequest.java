package pe.edu.upeu.oasis.seguridad.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CambiarPasswordRequest {
    @NotBlank(message = "La contraseña actual es requerida")
    private String passwordActual;

    @NotBlank(message = "La nueva contraseña es requerida")
    private String passwordNueva;
}
