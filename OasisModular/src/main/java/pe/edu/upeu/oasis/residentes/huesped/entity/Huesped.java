package pe.edu.upeu.oasis.residentes.huesped.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "OASIS_HUESPED")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Huesped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombreCompleto;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 30)
    private String telefono;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String tipoDocumento = "DNI";

    @Column(nullable = false, unique = true, length = 40)
    private String numeroDocumento;

    @Column(nullable = false, length = 40)
    @Builder.Default
    private String perfil = "ESTUDIANTE";

    @Column(nullable = false)
    @Builder.Default
    private Boolean esMenorDeEdad = false;

    @Embedded
    private ContactoApoderado apoderado;
}
