package pe.edu.upeu.oasis.comunicacion.actividad.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "OASIS_ACTIVIDAD_COMUNITARIA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActividadComunitaria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 1000)
    private String contenido;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String categoria = "NORMAS";

    @Column(nullable = false)
    private LocalDate fechaPublicacion;

    @Column(nullable = false)
    @Builder.Default
    private Boolean fijado = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}

