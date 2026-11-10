package pe.edu.upeu.oasis.alojamiento.habitacion.entity;

import jakarta.persistence.*;
import lombok.*;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.entity.TipoHabitacion;
import java.math.BigDecimal;

@Entity
@Table(name = "OASIS_HABITACION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Habitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String numero;

    @Column(nullable = false)
    private Integer piso;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "DISPONIBLE";

    @Column(nullable = false)
    @Builder.Default
    private Boolean amoblada = false;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String tipoBano = "COMPARTIDO";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_habitacion_id", nullable = false)
    private TipoHabitacion tipoHabitacion;

    public void bloquear() {
        if (!"DISPONIBLE".equalsIgnoreCase(this.estado)) {
            throw new IllegalStateException("La habitación " + this.numero + " no está disponible (Estado actual: " + this.estado + ")");
        }
        this.estado = "OCUPADO";
    }

    public void liberar() {
        this.estado = "DISPONIBLE";
    }
}
