package pe.edu.upeu.oasis.mantenimiento.reporte.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReporteRequest {
    @NotNull(message = "El ID del huésped es obligatorio")
    private Long huespedId;
    
    @NotNull(message = "El ID de la habitación es obligatorio")
    private Long habitacionId;
    
    @NotBlank(message = "El tipo de avería es obligatorio")
    private String tipoAveria;
    
    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;
}