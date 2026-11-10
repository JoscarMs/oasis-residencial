package pe.edu.upeu.oasis.alojamiento.habitacion.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HabitacionResponse {
    private Long id;
    private String numero;
    private Integer piso;
    private BigDecimal precio;
    private String estado;
    private Long tipoHabitacionId;
    private String tipoHabitacionNombre;
    private Boolean amoblada;
    private String tipoBano;
}
