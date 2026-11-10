package pe.edu.upeu.oasis.pagos.pago.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.exception.AccesoDenegadoException;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;
import pe.edu.upeu.oasis.pagos.pago.dto.PagoRequest;
import pe.edu.upeu.oasis.pagos.pago.dto.PagoResponse;
import pe.edu.upeu.oasis.pagos.pago.dto.ReporteIngresosDTO;
import pe.edu.upeu.oasis.pagos.pago.entity.Pago;
import pe.edu.upeu.oasis.pagos.pago.mapper.PagoMapper;
import pe.edu.upeu.oasis.pagos.pago.repository.PagoRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoServiceImpl implements PagoService {
    private final PagoRepository repository;
    private final PagoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<PagoResponse> listar() {
        return listar(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PagoResponse> listar(String usuarioId) {
        if (usuarioId == null) {
            return repository.findAll().stream().map(mapper::toResponse).toList();
        }
        return repository.findByUsuarioId(usuarioId).stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PagoResponse obtener(Long id) {
        return obtener(id, null);
    }

    @Override
    @Transactional(readOnly = true)
    public PagoResponse obtener(Long id, String usuarioId) {
        Pago entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado: " + id));
        if (usuarioId != null && !usuarioId.equals(entity.getUsuarioId())) {
            throw new AccesoDenegadoException("No tienes acceso a este registro de pago");
        }
        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public PagoResponse registrarPago(PagoRequest request) {
        return registrarPago(request, null);
    }

    @Override
    @Transactional
    public PagoResponse registrarPago(PagoRequest request, String usuarioId) {
        Pago entity = mapper.toEntity(request);
        if (usuarioId != null) {
            entity.setUsuarioId(usuarioId);
        }
        if (entity.getFechaPago() == null) {
            entity.setFechaPago(LocalDate.now());
        }
        if (entity.getEstado() == null || entity.getEstado().isBlank()) {
            entity.setEstado("PAGADO");
        }
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PagoResponse> listarPorContrato(Long contratoId) {
        return listarPorContrato(contratoId, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PagoResponse> listarPorContrato(Long contratoId, String usuarioId) {
        List<Pago> pagos = repository.findByContratoId(contratoId);
        if (usuarioId != null) {
            pagos = pagos.stream().filter(p -> usuarioId.equals(p.getUsuarioId())).toList();
        }
        return pagos.stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional
    public void anularPago(Long id) {
        Pago entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado: " + id));
        entity.setEstado("ANULADO");
        repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public ReporteIngresosDTO generarReporteMensual(int anio, int mes) {
        YearMonth ym = YearMonth.of(anio, mes);
        LocalDate inicio = ym.atDay(1);
        LocalDate fin = ym.atEndOfMonth();

        List<Pago> pagos = repository.findByFechaPagoBetween(inicio, fin).stream()
                .filter(p -> "PAGADO".equalsIgnoreCase(p.getEstado()))
                .toList();

        BigDecimal total = pagos.stream()
                .map(Pago::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ReporteIngresosDTO.builder()
                .anio(anio)
                .mes(mes)
                .periodo(ym.toString())
                .totalRecaudado(total)
                .cantidadPagos((long) pagos.size())
                .generadoPorRol("ROLE_ADMIN")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ReporteIngresosDTO generarReporteAnual(int anio) {
        LocalDate inicio = LocalDate.of(anio, 1, 1);
        LocalDate fin = LocalDate.of(anio, 12, 31);

        List<Pago> pagos = repository.findByFechaPagoBetween(inicio, fin).stream()
                .filter(p -> "PAGADO".equalsIgnoreCase(p.getEstado()))
                .toList();

        BigDecimal total = pagos.stream()
                .map(Pago::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ReporteIngresosDTO.builder()
                .anio(anio)
                .mes(null)
                .periodo("Año " + anio)
                .totalRecaudado(total)
                .cantidadPagos((long) pagos.size())
                .generadoPorRol("ROLE_ADMIN")
                .build();
    }
}
