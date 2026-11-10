package pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TipoHabitacionRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    private String descripcion;
    @NotNull(message = "El precio base es obligatorio")
    @Positive(message = "El precio base debe ser mayor a 0")
    private BigDecimal precioBase;
    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "Capacidad mínima 1 persona")
    private Integer capacidadPersonas;
}
