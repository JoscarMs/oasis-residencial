package pe.edu.upeu.oasis.contratos.contrato.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TipoContratoResponse {
    private Long id;
    private String nombre;
    private Integer duracionMeses;
    private Boolean penalidadIncumplimiento;
}