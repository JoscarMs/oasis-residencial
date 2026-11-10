package pe.edu.upeu.oasis.contratos.contrato.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContratoRequest {
    @NotNull(message = "El ID del huésped es obligatorio")
    private Long huespedId;
    @NotNull(message = "El ID de la habitación es obligatorio")
    private Long habitacionId;

    private Long tipoContratoId;
    @NotNull(message = "Fecha de inicio obligatoria")
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    @NotEmpty(message = "El contrato debe incluir al menos un detalle de cobro (Alquiler/Garantía)")
    @Valid
    private List<DetalleContratoDTO> detalles;
}
