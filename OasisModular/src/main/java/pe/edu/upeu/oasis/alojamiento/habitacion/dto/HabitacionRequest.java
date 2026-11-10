package pe.edu.upeu.oasis.alojamiento.habitacion.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HabitacionRequest {
    @NotBlank(message = "El número de habitación es obligatorio")
    private String numero;
    @NotNull(message = "El piso es obligatorio")
    @Min(value = 1, message = "El piso debe ser al menos 1")
    private Integer piso;
    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private BigDecimal precio;
    private String estado;
    @NotNull(message = "El ID del tipo de habitación es obligatorio")
    private Long tipoHabitacionId;
    
    @Builder.Default
    private Boolean amoblada = false;

    @Pattern(regexp = "^(PRIVADO|COMPARTIDO)$", message = "El baño debe ser PRIVADO o COMPARTIDO")
    @Builder.Default
    private String tipoBano = "COMPARTIDO";
}
