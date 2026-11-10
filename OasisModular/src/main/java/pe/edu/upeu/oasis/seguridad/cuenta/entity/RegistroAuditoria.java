package pe.edu.upeu.oasis.seguridad.cuenta.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "OASIS_AUDITORIA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroAuditoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String correlationId;

    @Column(nullable = false, length = 60)
    private String username;

    @Column(nullable = false, length = 100)
    private String accion;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 50)
    private String ipOrigen;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "EXITO";
}
