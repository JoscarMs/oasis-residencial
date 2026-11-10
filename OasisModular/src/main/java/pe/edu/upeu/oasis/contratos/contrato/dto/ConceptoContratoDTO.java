package pe.edu.upeu.oasis.contratos.contrato.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConceptoContratoDTO {
    private Long id;

    @NotBlank(message = "El nombre del concepto es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio sugerido es obligatorio")
    @Positive(message = "El precio debe ser positivo")
    private BigDecimal precioSugerido;

    private String categoria;
    private String icono;
    private Boolean activo;
}
