package pe.edu.upeu.oasis.contratos.contrato.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContratoResponse {
    private Long id;
    private String codigoContrato;
    private Long huespedId;
    private Long habitacionId;
    private Long tipoContratoId;
    private String tipoContratoNombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal totalContrato;
    private String estado;
    private String huespedNombre;
    private String huespedDni;
    private String habitacionNumero;
    private String habitacionTipo;
    private BigDecimal habitacionPrecio;
    private List<DetalleContratoDTO> detalles;
}
