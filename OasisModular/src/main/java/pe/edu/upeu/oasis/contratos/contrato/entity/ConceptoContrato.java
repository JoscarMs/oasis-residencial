package pe.edu.upeu.oasis.contratos.contrato.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "OASIS_CONCEPTO_CONTRATO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConceptoContrato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precioSugerido;

    @Column(length = 50)
    private String categoria; // GARANTIA, SERVICIO, COCHERA, EQUIPAMIENTO, OTRO

    @Column(length = 10)
    private String icono; // 🛡️, 🌐, 🚗, 🧊, ♨️, 🧹, 📦

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}
