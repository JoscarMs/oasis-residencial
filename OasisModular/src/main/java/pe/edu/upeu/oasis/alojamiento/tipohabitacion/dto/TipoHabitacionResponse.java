package pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TipoHabitacionResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precioBase;
    private Integer capacidadPersonas;
}
