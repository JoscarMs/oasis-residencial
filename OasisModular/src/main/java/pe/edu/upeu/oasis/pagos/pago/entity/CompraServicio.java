package pe.edu.upeu.oasis.pagos.pago.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "OASIS_COMPRA_SERVICIO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompraServicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long servicioId;

    @Column(nullable = false, length = 100)
    private String servicioNombre;

    @Column(length = 36)
    private String usuarioId; // UUID de Keycloak

    @Column(nullable = false, length = 120)
    private String huespedNombre;

    @Column(nullable = false, length = 20)
    private String habitacionNumero;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private BigDecimal precioUnitario;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(nullable = false)
    private LocalDate fechaSolicitud;

    @Column(length = 255)
    private String notas;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "PENDIENTE"; // PENDIENTE, EN_PROCESO, ENTREGADO, CANCELADO
}
