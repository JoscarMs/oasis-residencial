package pe.edu.upeu.oasis.pagos.pago.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.edu.upeu.oasis.pagos.pago.dto.PagoRequest;
import pe.edu.upeu.oasis.pagos.pago.dto.PagoResponse;
import pe.edu.upeu.oasis.pagos.pago.dto.ReporteIngresosDTO;
import pe.edu.upeu.oasis.pagos.pago.service.PagoService;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PagoController.class)
class PagoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PagoService pagoService;

    @Test
    void registrarPago_conDatosValidos_respondeCreated() throws Exception {
        PagoRequest req = PagoRequest.builder()
                .contratoId(1L)
                .monto(new BigDecimal("450.00"))
                .metodoPago("YAPE")
                .numeroComprobante("OPE-123456")
                .build();

        PagoResponse res = PagoResponse.builder()
                .id(1L)
                .contratoId(1L)
                .monto(new BigDecimal("450.00"))
                .metodoPago("YAPE")
                .numeroComprobante("OPE-123456")
                .estado("CONFIRMADO")
                .fechaPago(LocalDate.now())
                .build();

        when(pagoService.registrarPago(any())).thenReturn(res);

        mockMvc.perform(post("/api/v1/pagos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.metodoPago").value("YAPE"));
    }

    @Test
    void reporteMensual_respondeOk() throws Exception {
        ReporteIngresosDTO rep = ReporteIngresosDTO.builder()
                .periodo("2026-09")
                .totalRecaudado(new BigDecimal("4500.00"))
                .cantidadPagos(10L)
                .build();

        when(pagoService.generarReporteMensual(2026, 9)).thenReturn(rep);

        mockMvc.perform(get("/api/v1/pagos/reportes/mensual")
                        .param("anio", "2026")
                        .param("mes", "9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.periodo").value("2026-09"))
                .andExpect(jsonPath("$.totalRecaudado").value(4500.00));
    }
}
