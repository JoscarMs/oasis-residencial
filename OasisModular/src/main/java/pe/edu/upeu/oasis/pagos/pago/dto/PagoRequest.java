package pe.edu.upeu.oasis.pagos.pago.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PagoRequest {
    @NotNull(message = "El ID del contrato es obligatorio")
    private Long contratoId;
    @NotNull(message = "El monto es obligatorio")
    @Positive(message = "El monto debe ser positivo")
    private BigDecimal monto;
    private LocalDate fechaPago;
    private String metodoPago;
    private String estado;
    private String numeroComprobante;
}
