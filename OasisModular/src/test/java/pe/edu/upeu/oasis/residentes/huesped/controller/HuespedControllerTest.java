package pe.edu.upeu.oasis.residentes.huesped.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedRequest;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedResponse;
import pe.edu.upeu.oasis.residentes.huesped.service.HuespedService;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HuespedController.class)
class HuespedControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private HuespedService huespedService;

    @Test
    void listar_respondeListaHuespedes() throws Exception {
        HuespedResponse h = HuespedResponse.builder()
                .id(1L)
                .nombreCompleto("Juan Perez")
                .numeroDocumento("72345678")
                .tipoDocumento("DNI")
                .perfil("ESTUDIANTE")
                .esMenorDeEdad(false)
                .build();

        when(huespedService.listar()).thenReturn(List.of(h));

        mockMvc.perform(get("/api/v1/residentes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombreCompleto").value("Juan Perez"))
                .andExpect(jsonPath("$[0].numeroDocumento").value("72345678"));
    }

    @Test
    void crear_conDatosValidos_respondeCreated() throws Exception {
        HuespedRequest request = HuespedRequest.builder()
                .nombreCompleto("Carlos Egresado")
                .tipoDocumento("DNI")
                .numeroDocumento("45678901")
                .email("carlos@oasis.pe")
                .telefono("987654321")
                .perfil("PROFESIONAL_EGRESADO")
                .esMenorDeEdad(false)
                .build();

        HuespedResponse response = HuespedResponse.builder()
                .id(10L)
                .nombreCompleto("Carlos Egresado")
                .numeroDocumento("45678901")
                .perfil("PROFESIONAL_EGRESADO")
                .build();

        when(huespedService.crear(any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/residentes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.perfil").value("PROFESIONAL_EGRESADO"));
    }
}
