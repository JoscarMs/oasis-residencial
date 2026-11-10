package pe.edu.upeu.oasis.seguridad.cuenta.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "OASIS_CUENTA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String username;

    @Column(nullable = false, length = 120)
    private String passwordHash;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String rol = "ROLE_RESIDENTE";

    private Long huespedId;

    @Column(length = 60)
    private String passwordInicial;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    private LocalDateTime ultimoAcceso;
}
