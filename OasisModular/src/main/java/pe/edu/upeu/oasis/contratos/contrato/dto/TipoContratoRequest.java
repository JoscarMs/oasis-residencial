package pe.edu.upeu.oasis.contratos.contrato.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TipoContratoRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    @NotNull(message = "La duración es obligatoria")
    private Integer duracionMeses;
    private Boolean penalidadIncumplimiento;
}