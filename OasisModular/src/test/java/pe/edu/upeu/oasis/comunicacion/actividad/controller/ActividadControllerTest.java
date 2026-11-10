package pe.edu.upeu.oasis.comunicacion.actividad.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadRequest;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadResponse;
import pe.edu.upeu.oasis.comunicacion.actividad.service.ActividadService;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ActividadController.class)
class ActividadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ActividadService ActividadService;

    @Test
    void listar_respondeListaActividads() throws Exception {
        ActividadResponse av = ActividadResponse.builder()
                .id(1L)
                .titulo("Mantenimiento de Red WiFi")
                .contenido("Se realizara mantenimiento el dia sabado a las 10:00 AM")
                .categoria("MANTENIMIENTO")
                .fechaPublicacion(LocalDate.now())
                .fijado(true)
                .activo(true)
                .build();

        when(ActividadService.listarActivos()).thenReturn(List.of(av));

        mockMvc.perform(get("/api/v1/actividades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Mantenimiento de Red WiFi"))
                .andExpect(jsonPath("$[0].categoria").value("MANTENIMIENTO"));
    }

    @Test
    void publicar_conDatosValidos_respondeCreated() throws Exception {
        ActividadRequest req = ActividadRequest.builder()
                .titulo("Reunión de Convivencia")
                .contenido("Reunión comunitaria en el patio central")
                .categoria("CONVIVENCIA")
                .fijado(false)
                .build();

        ActividadResponse res = ActividadResponse.builder()
                .id(2L)
                .titulo("Reunión de Convivencia")
                .contenido("Reunión comunitaria en el patio central")
                .categoria("CONVIVENCIA")
                .fijado(false)
                .activo(true)
                .build();

        when(ActividadService.publicar(any())).thenReturn(res);

        mockMvc.perform(post("/api/v1/actividades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.titulo").value("Reunión de Convivencia"));
    }
}
