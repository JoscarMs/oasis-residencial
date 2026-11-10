package pe.edu.upeu.oasis.seguridad.cuenta.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioRequest;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioResponse;
import pe.edu.upeu.oasis.seguridad.cuenta.service.CuentaUsuarioService;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CuentaUsuarioController.class)
class CuentaUsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CuentaUsuarioService cuentaUsuarioService;

    @Test
    void listar_respondeListaCuentas() throws Exception {
        CuentaUsuarioResponse c = CuentaUsuarioResponse.builder()
                .id(1L)
                .username("admin")
                .rol("ADMIN")
                .activo(true)
                .build();

        when(cuentaUsuarioService.listar()).thenReturn(List.of(c));

        mockMvc.perform(get("/api/v1/cuentas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("admin"))
                .andExpect(jsonPath("$[0].rol").value("ADMIN"));
    }

    @Test
    void registrar_conDatosValidos_respondeCreated() throws Exception {
        CuentaUsuarioRequest req = CuentaUsuarioRequest.builder()
                .username("recepcion")
                .password("Clave123*")
                .rol("RECEPCION")
                .build();

        CuentaUsuarioResponse res = CuentaUsuarioResponse.builder()
                .id(2L)
                .username("recepcion")
                .rol("RECEPCION")
                .activo(true)
                .build();

        when(cuentaUsuarioService.crear(any())).thenReturn(res);

        mockMvc.perform(post("/api/v1/cuentas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.username").value("recepcion"));
    }
}
