package pe.edu.upeu.oasis.pagos.pago.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "OASIS_PAGO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long contratoId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false)
    private LocalDate fechaPago;

    @Column(nullable = false, length = 40)
    @Builder.Default
    private String metodoPago = "TRANSFERENCIA";

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "PAGADO";

    @Column(length = 60)
    private String numeroComprobante;

    @Column(name = "USUARIO_ID", length = 36)
    private String usuarioId;
}
