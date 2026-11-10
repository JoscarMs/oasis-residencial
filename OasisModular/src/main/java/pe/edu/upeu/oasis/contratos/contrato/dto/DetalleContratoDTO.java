package pe.edu.upeu.oasis.contratos.contrato.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DetalleContratoDTO {
    private Long id;
    @NotBlank(message = "El concepto es obligatorio (Alquiler, Garantía, etc.)")
    private String concepto;
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "Cantidad mínima 1")
    private Integer cantidad;
    @NotNull(message = "El precio unitario es obligatorio")
    @Positive(message = "Precio debe ser mayor a 0")
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
