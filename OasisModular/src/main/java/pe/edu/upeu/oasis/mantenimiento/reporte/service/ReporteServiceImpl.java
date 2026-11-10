package pe.edu.upeu.oasis.mantenimiento.reporte.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.mantenimiento.reporte.dto.ReporteRequest;
import pe.edu.upeu.oasis.mantenimiento.reporte.dto.ReporteResponse;
import pe.edu.upeu.oasis.mantenimiento.reporte.entity.ReporteMantenimiento;
import pe.edu.upeu.oasis.mantenimiento.reporte.mapper.ReporteMapper;
import pe.edu.upeu.oasis.mantenimiento.reporte.repository.ReporteRepository;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteServiceImpl implements ReporteService {
    private final ReporteRepository repository;
    private final ReporteMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<ReporteResponse> listarTodos() {
        return repository.findAllByOrderByFechaReporteDesc().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReporteResponse> listarPorHuesped(Long huespedId) {
        return repository.findByHuespedIdOrderByFechaReporteDesc(huespedId).stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReporteResponse obtener(Long id) {
        return repository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado: " + id));
    }

    @Override
    @Transactional
    public ReporteResponse crear(ReporteRequest request) {
        ReporteMantenimiento entity = mapper.toEntity(request);
        entity.setEstado("REPORTADO");
        entity.setFechaReporte(LocalDate.now());
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public ReporteResponse actualizarEstado(Long id, String estado) {
        ReporteMantenimiento entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado: " + id));
        entity.setEstado(estado);
        return mapper.toResponse(repository.save(entity));
    }
}