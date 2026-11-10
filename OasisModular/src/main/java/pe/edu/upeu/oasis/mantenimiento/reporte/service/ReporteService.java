package pe.edu.upeu.oasis.mantenimiento.reporte.service;

import pe.edu.upeu.oasis.mantenimiento.reporte.dto.ReporteRequest;
import pe.edu.upeu.oasis.mantenimiento.reporte.dto.ReporteResponse;
import java.util.List;

public interface ReporteService {
    List<ReporteResponse> listarTodos();
    List<ReporteResponse> listarPorHuesped(Long huespedId);
    ReporteResponse obtener(Long id);
    ReporteResponse crear(ReporteRequest request);
    ReporteResponse actualizarEstado(Long id, String estado);
}