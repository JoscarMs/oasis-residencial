package pe.edu.upeu.oasis.contratos.contrato.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoRequest;
import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoResponse;
import pe.edu.upeu.oasis.contratos.contrato.dto.DetalleContratoDTO;
import pe.edu.upeu.oasis.contratos.contrato.service.ContratoService;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContratoController.class)
class ContratoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ContratoService contratoService;

    @Test
    void listar_respondeListaContratos() throws Exception {
        ContratoResponse cr = ContratoResponse.builder()
                .id(1L)
                .codigoContrato("CON-2026-0001")
                .huespedId(1L)
                .habitacionId(101L).tipoContratoId(1L)
                .fechaInicio(LocalDate.of(2026, 3, 1))
                .fechaFin(LocalDate.of(2026, 12, 31))
                .totalContrato(new BigDecimal("4500.00"))
                .estado("VIGENTE")
                .build();

        when(contratoService.listar()).thenReturn(List.of(cr));

        mockMvc.perform(get("/api/v1/contratos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].codigoContrato").value("CON-2026-0001"))
                .andExpect(jsonPath("$[0].estado").value("VIGENTE"));
    }

    @Test
    void formalizar_conDatosValidos_respondeCreated() throws Exception {
        DetalleContratoDTO det = DetalleContratoDTO.builder()
                .concepto("MENSUALIDAD")
                .cantidad(1)
                .precioUnitario(new BigDecimal("450.00"))
                .subtotal(new BigDecimal("450.00"))
                .build();

        ContratoRequest req = ContratoRequest.builder()
                .huespedId(1L)
                .habitacionId(101L).tipoContratoId(1L)
                .fechaInicio(LocalDate.of(2026, 3, 1))
                .fechaFin(LocalDate.of(2026, 12, 31))
                .detalles(List.of(det))
                .build();

        ContratoResponse res = ContratoResponse.builder()
                .id(1L)
                .codigoContrato("CON-2026-0001")
                .huespedId(1L)
                .habitacionId(101L).tipoContratoId(1L)
                .totalContrato(new BigDecimal("450.00"))
                .estado("VIGENTE")
                .build();

        when(contratoService.formalizarContrato(any())).thenReturn(res);

        mockMvc.perform(post("/api/v1/contratos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.codigoContrato").value("CON-2026-0001"));
    }
}
