package pe.edu.upeu.oasis.contratos.contrato.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "OASIS_TIPO_CONTRATO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoContrato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Integer duracionMeses;

    @Column(nullable = false)
    @Builder.Default
    private Boolean penalidadIncumplimiento = true;
}