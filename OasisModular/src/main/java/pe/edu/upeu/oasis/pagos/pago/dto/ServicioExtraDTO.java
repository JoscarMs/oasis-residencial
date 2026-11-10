package pe.edu.upeu.oasis.pagos.pago.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicioExtraDTO {
    private Long id;

    @NotBlank(message = "El nombre del servicio es obligatorio")
    private String nombre;

    private String descripcion;
    private String categoria;
    private String icono;
    private String unidad;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser positivo")
    private BigDecimal precio;

    private Boolean activo;
}
