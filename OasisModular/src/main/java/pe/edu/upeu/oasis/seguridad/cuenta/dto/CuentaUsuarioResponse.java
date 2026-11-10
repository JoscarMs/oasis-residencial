package pe.edu.upeu.oasis.seguridad.cuenta.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CuentaUsuarioResponse {
    private Long id;
    private String username;
    private String rol;
    private Long huespedId;
    private String nombreCompleto;
    private String numeroDocumento;
    private String passwordInicial;
    private Boolean activo;
    private LocalDateTime ultimoAcceso;
}
