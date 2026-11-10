package pe.edu.upeu.oasis.contratos.contrato.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "OASIS_CONTRATO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratoResidencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigoContrato;

    @Column(nullable = false)
    private Long huespedId;

    @Column(nullable = false)
    private Long habitacionId;

    @Column(nullable = false)
    private Long tipoContratoId;

    @Column(nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private LocalDate fechaFin;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalContrato;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "VIGENTE";

    @OneToMany(mappedBy = "contrato", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetalleContrato> detalles = new ArrayList<>();

    public void agregarDetalle(DetalleContrato detalle) {
        detalles.add(detalle);
        detalle.setContrato(this);
    }
}
