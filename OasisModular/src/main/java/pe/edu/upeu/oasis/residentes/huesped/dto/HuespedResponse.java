package pe.edu.upeu.oasis.residentes.huesped.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HuespedResponse {
    private Long id;
    private String nombreCompleto;
    private String email;
    private String telefono;
    private String tipoDocumento;
    private String numeroDocumento;
    private String perfil;
    private Boolean esMenorDeEdad;
    private String nombreApoderado;
    private String telefonoApoderado;
    private String dniApoderado;
    private String parentesco;
}
