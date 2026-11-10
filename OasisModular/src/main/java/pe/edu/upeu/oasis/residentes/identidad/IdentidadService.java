package pe.edu.upeu.oasis.residentes.identidad;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

/**
 * Consulta de DNI (RENIEC) y RUC (SUNAT) mediante un proveedor externo (por defecto Decolecta,
 * sucesor de apis.net.pe). El token se configura con la variable de entorno RENIEC_API_TOKEN
 * y nunca se expone al navegador.
 */
@Slf4j
@Service
public class IdentidadService {

    private final RestClient client;
    private final String token;

    private static final String DEFAULT_TOKEN = "sk_21338.mJbXANpbZ6idba5P32kodCOmMJTia5pS";

    public IdentidadService(
            @Value("${oasis.identidad.base-url:https://api.decolecta.com/v1}") String baseUrl,
            @Value("${oasis.identidad.token:}") String token) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);
        factory.setReadTimeout(8_000);
        this.client = RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
        String t = (token == null || token.isBlank()) ? DEFAULT_TOKEN : token.trim();
        this.token = t;
    }

    public boolean habilitado() {
        return !token.isEmpty();
    }

    public IdentidadResponse consultarDni(String dni) {
        if (dni == null || !dni.matches("\\d{8}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El DNI debe tener 8 dígitos numéricos");
        }
        Map<String, Object> d = llamar("/reniec/dni", dni);
        String nombres = texto(d, "first_name", "nombres");
        String paterno = texto(d, "first_last_name", "apellidoPaterno");
        String materno = texto(d, "second_last_name", "apellidoMaterno");
        String completo = texto(d, "full_name", "nombreCompleto");
        
        // Si tenemos nombres y apellidos, formatear a formato legible "Nombres Apellidos"
        if (!nombres.isBlank() && !paterno.isBlank()) {
            completo = (nombres + " " + paterno + " " + materno).trim().replaceAll("\\s+", " ");
        } else if (completo.isBlank()) {
            completo = (nombres + " " + paterno + " " + materno).trim().replaceAll("\\s+", " ");
        }
        if (completo.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontraron datos para el DNI " + dni);
        }
        return new IdentidadResponse("DNI", dni, completo, nombres, paterno, materno, null, null);
    }

    public IdentidadResponse consultarRuc(String ruc) {
        if (ruc == null || !ruc.matches("\\d{11}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El RUC debe tener 11 dígitos numéricos");
        }
        Map<String, Object> d = llamar("/sunat/ruc", ruc);
        String razon = texto(d, "razon_social", "razonSocial", "nombre");
        if (razon.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontraron datos para el RUC " + ruc);
        }
        return new IdentidadResponse("RUC", ruc, razon, null, null, null,
                texto(d, "direccion"), texto(d, "estado"));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> llamar(String path, String numero) {
        if (!habilitado()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Consulta RENIEC/SUNAT no configurada: defina la variable de entorno RENIEC_API_TOKEN");
        }
        try {
            Map<String, Object> body = client.get()
                    .uri(u -> u.path(path).queryParam("numero", numero).build())
                    .header("Authorization", "Bearer " + token)
                    .header("Accept", "application/json")
                    .retrieve()
                    .body(Map.class);
            if (body == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sin datos para el documento " + numero);
            }
            // Algunos proveedores envuelven la respuesta en "data"
            Object data = body.get("data");
            return data instanceof Map<?, ?> m ? (Map<String, Object>) m : body;
        } catch (HttpClientErrorException e) {
            log.warn("Proveedor de identidad respondió {} para {}", e.getStatusCode().value(), numero);
            int s = e.getStatusCode().value();
            if (s == 404 || s == 422) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento no encontrado: " + numero);
            }
            if (s == 401 || s == 403) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Token de consulta RENIEC inválido o sin cuota");
            }
            if (s == 429) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Límite de consultas RENIEC alcanzado");
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error del proveedor de consulta de identidad");
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.warn("No se pudo consultar identidad: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "No se pudo contactar al servicio de consulta de identidad");
        }
    }

    private static String texto(Map<String, Object> m, String... claves) {
        for (String k : claves) {
            Object v = m.get(k);
            if (v != null && !v.toString().isBlank()) {
                return v.toString().trim();
            }
        }
        return "";
    }
}
