package pe.edu.upeu.oasis.comunicacion.actividad.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActividadRequest {
    @NotBlank(message = "El tÃ­tulo es obligatorio")
    private String titulo;
    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;
    private String categoria;
    private Boolean fijado;
}

