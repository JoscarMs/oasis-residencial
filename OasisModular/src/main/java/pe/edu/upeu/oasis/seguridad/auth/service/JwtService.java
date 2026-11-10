package pe.edu.upeu.oasis.seguridad.auth.service;

import com.nimbusds.jose.jwk.RSAKey;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.CuentaUsuario;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtEncoder jwtEncoder;
    private final RSAKey rsaKey;

    @Value("${jwt.issuer:residencia-oasis}")
    private String issuer;

    @Getter
    @Value("${jwt.expiracion-segundos:86400}")
    private long expiracionSegundos;

    public String generarToken(CuentaUsuario usuario) {
        Instant ahora = Instant.now();
        String rolLimpio = usuario.getRol() != null ? usuario.getRol().replace("ROLE_", "") : "RESIDENTE";
        List<String> roles = List.of(rolLimpio);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .subject(String.valueOf(usuario.getId()))
                .issuedAt(ahora)
                .expiresAt(ahora.plusSeconds(expiracionSegundos))
                .claim("preferred_username", usuario.getUsername())
                .claim("email", usuario.getUsername() + "@oasis.pe")
                .claim("realm_access", Map.of("roles", roles))
                .build();

        JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256)
                .keyId(rsaKey.getKeyID())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
