package pe.edu.upeu.oasis.pagos.pago.service;

import pe.edu.upeu.oasis.pagos.pago.dto.PagoRequest;
import pe.edu.upeu.oasis.pagos.pago.dto.PagoResponse;
import pe.edu.upeu.oasis.pagos.pago.dto.ReporteIngresosDTO;

import java.util.List;

public interface PagoService {
    List<PagoResponse> listar();
    List<PagoResponse> listar(String usuarioId);
    PagoResponse obtener(Long id);
    PagoResponse obtener(Long id, String usuarioId);
    PagoResponse registrarPago(PagoRequest request);
    PagoResponse registrarPago(PagoRequest request, String usuarioId);
    List<PagoResponse> listarPorContrato(Long contratoId);
    List<PagoResponse> listarPorContrato(Long contratoId, String usuarioId);
    void anularPago(Long id);
    ReporteIngresosDTO generarReporteMensual(int anio, int mes);
    ReporteIngresosDTO generarReporteAnual(int anio);
}
