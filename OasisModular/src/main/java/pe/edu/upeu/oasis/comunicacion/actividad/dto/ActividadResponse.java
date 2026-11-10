package pe.edu.upeu.oasis.comunicacion.actividad.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActividadResponse {
    private Long id;
    private String titulo;
    private String contenido;
    private String categoria;
    private LocalDate fechaPublicacion;
    private Boolean fijado;
    private Boolean activo;
}

