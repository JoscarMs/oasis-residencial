package pe.edu.upeu.oasis.mantenimiento.reporte.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReporteResponse {
    private Long id;
    private Long huespedId;
    private Long habitacionId;
    private String tipoAveria;
    private String descripcion;
    private String estado;
    private LocalDate fechaReporte;
}