package pe.edu.upeu.oasis.seguridad.auth.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PerfilResponse {
    private String sub;
    private String username;
    private String email;
    private List<String> roles;
}
