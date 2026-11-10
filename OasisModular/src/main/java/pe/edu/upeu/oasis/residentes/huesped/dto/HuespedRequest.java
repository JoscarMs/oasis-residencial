package pe.edu.upeu.oasis.residentes.huesped.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HuespedRequest {
    /** Opcional: si viene vacío se completa automáticamente desde RENIEC/SUNAT usando el documento. */
    private String nombreCompleto;
    /** Opcional: si viene vacío se genera un correo provisional a partir del documento. */
    @Email(message = "Email inválido")
    private String email;
    private String telefono;
    private String tipoDocumento;
    @NotBlank(message = "El número de documento es obligatorio")
    private String numeroDocumento;
    private String perfil;
    private Boolean esMenorDeEdad;
    private String nombreApoderado;
    private String telefonoApoderado;
    private String dniApoderado;
    private String parentesco;
}
