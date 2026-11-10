package pe.edu.upeu.oasis.seguridad.auth.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    @Builder.Default
    private Long expiresIn = 86400L;
    private String username;
    private List<String> roles;
}
