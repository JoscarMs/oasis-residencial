package pe.edu.upeu.oasis.residentes.identidad;

/**
 * Datos de identidad obtenidos de RENIEC (DNI) o SUNAT (RUC).
 * Para un RUC, {@code nombreCompleto} contiene la razón social.
 */
public record IdentidadResponse(
        String tipoDocumento,
        String numeroDocumento,
        String nombreCompleto,
        String nombres,
        String apellidoPaterno,
        String apellidoMaterno,
        String direccion,
        String estado) {
}
