package pe.edu.upeu.oasis.pagos.pago.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompraServicioDTO {
    private Long id;

    @NotNull(message = "El ID del servicio es obligatorio")
    private Long servicioId;

    private String servicioNombre;
    private String usuarioId;
    private String huespedNombre;
    private String habitacionNumero;

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    private BigDecimal precioUnitario;
    private BigDecimal total;
    private LocalDate fechaSolicitud;
    private String notas;
    private String estado;
}
