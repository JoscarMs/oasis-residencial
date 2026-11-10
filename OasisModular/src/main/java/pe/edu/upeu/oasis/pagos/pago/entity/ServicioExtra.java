package pe.edu.upeu.oasis.pagos.pago.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "OASIS_SERVICIO_EXTRA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicioExtra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(length = 50)
    private String categoria;

    @Column(length = 10)
    private String icono;

    @Column(length = 50)
    private String unidad;
    
    @Column(nullable = false)
    private BigDecimal precioMensual;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    public BigDecimal getPrecio() {
        return precioMensual;
    }

    public void setPrecio(BigDecimal precio) {
        this.precioMensual = precio;
    }
}