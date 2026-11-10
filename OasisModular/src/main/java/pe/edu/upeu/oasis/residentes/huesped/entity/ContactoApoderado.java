package pe.edu.upeu.oasis.residentes.huesped.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactoApoderado {
    @Column(name = "apoderado_nombre", length = 120)
    private String nombreApoderado;

    @Column(name = "apoderado_telefono", length = 30)
    private String telefonoApoderado;

    @Column(name = "apoderado_dni", length = 30)
    private String dniApoderado;

    @Column(name = "apoderado_parentesco", length = 50)
    private String parentesco;
}
