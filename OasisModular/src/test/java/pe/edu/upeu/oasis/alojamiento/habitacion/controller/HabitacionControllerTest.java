package pe.edu.upeu.oasis.alojamiento.habitacion.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionResponse;
import pe.edu.upeu.oasis.alojamiento.habitacion.service.HabitacionService;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HabitacionController.class)
class HabitacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private HabitacionService habitacionService;

    @Test
    void listar_respondeListaHabitaciones() throws Exception {
        HabitacionResponse hab = HabitacionResponse.builder()
                .id(1L)
                .numero("101")
                .piso(1).amoblada(true).tipoBano("PRIVADO")
                .precio(new BigDecimal("450.00"))
                .estado("DISPONIBLE").amoblada(true).tipoBano("PRIVADO")
                .tipoHabitacionNombre("Individual")
                .build();

        when(habitacionService.listar(null)).thenReturn(List.of(hab));

        mockMvc.perform(get("/api/v1/habitaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].numero").value("101"))
                .andExpect(jsonPath("$[0].estado").value("DISPONIBLE"));
    }

    @Test
    void crear_conDatosValidos_respondeCreated() throws Exception {
        HabitacionRequest request = HabitacionRequest.builder()
                .numero("201")
                .piso(2).amoblada(true).tipoBano("PRIVADO")
                .precio(new BigDecimal("600.00"))
                .tipoHabitacionId(1L)
                .build();

        HabitacionResponse response = HabitacionResponse.builder()
                .id(2L)
                .numero("201")
                .piso(2).amoblada(true).tipoBano("PRIVADO")
                .precio(new BigDecimal("600.00"))
                .estado("DISPONIBLE").amoblada(true).tipoBano("PRIVADO")
                .build();

        when(habitacionService.crear(any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/habitaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.numero").value("201"));
    }
}