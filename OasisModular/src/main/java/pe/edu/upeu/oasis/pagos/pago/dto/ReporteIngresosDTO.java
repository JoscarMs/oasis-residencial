package pe.edu.upeu.oasis.pagos.pago.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReporteIngresosDTO {
    private Integer anio;
    private Integer mes;
    private String periodo;
    private BigDecimal totalRecaudado;
    private Long cantidadPagos;
    private String generadoPorRol;
}
