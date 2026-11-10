package pe.edu.upeu.oasis.mantenimiento.reporte.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "OASIS_REPORTE_MANTENIMIENTO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteMantenimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long huespedId;

    @Column(nullable = false)
    private Long habitacionId;

    @Column(nullable = false, length = 50)
    private String tipoAveria;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "REPORTADO";

    @Column(nullable = false)
    @Builder.Default
    private LocalDate fechaReporte = LocalDate.now();
}