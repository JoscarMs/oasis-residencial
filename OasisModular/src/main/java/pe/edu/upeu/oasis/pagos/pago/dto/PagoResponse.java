package pe.edu.upeu.oasis.pagos.pago.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PagoResponse {
    private Long id;
    private Long contratoId;
    private BigDecimal monto;
    private LocalDate fechaPago;
    private String metodoPago;
    private String estado;
    private String numeroComprobante;
    private String usuarioId;
}
