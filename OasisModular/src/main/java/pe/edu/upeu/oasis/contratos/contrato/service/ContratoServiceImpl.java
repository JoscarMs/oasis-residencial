package pe.edu.upeu.oasis.contratos.contrato.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionResponse;
import pe.edu.upeu.oasis.alojamiento.habitacion.service.HabitacionService;
import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoRequest;
import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoResponse;
import pe.edu.upeu.oasis.contratos.contrato.dto.DetalleContratoDTO;
import pe.edu.upeu.oasis.contratos.contrato.entity.ContratoResidencia;
import pe.edu.upeu.oasis.contratos.contrato.entity.DetalleContrato;
import pe.edu.upeu.oasis.contratos.contrato.entity.TipoContrato;
import pe.edu.upeu.oasis.contratos.contrato.mapper.ContratoMapper;
import pe.edu.upeu.oasis.contratos.contrato.repository.ContratoRepository;
import pe.edu.upeu.oasis.contratos.contrato.repository.TipoContratoRepository;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;
import pe.edu.upeu.oasis.residentes.huesped.service.HuespedService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContratoServiceImpl implements ContratoService {
    private final ContratoRepository repository;
    private final TipoContratoRepository tipoContratoRepository;
    private final ContratoMapper mapper;
    private final HabitacionService habitacionService;
    private final HuespedService huespedService;

    @Override
    @Transactional(readOnly = true)
    public List<ContratoResponse> listar() {
        return listar(null, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContratoResponse> listar(String estado, java.time.LocalDate desde, java.time.LocalDate hasta) {
        List<ContratoResidencia> lista;
        boolean hasEstado = estado != null && !estado.isBlank() && !"TODOS".equalsIgnoreCase(estado);
        boolean hasFechas = desde != null && hasta != null;

        if (hasEstado && hasFechas) {
            lista = repository.findByEstadoAndFechaInicioBetween(estado, desde, hasta);
        } else if (hasEstado) {
            lista = repository.findByEstado(estado);
        } else if (hasFechas) {
            lista = repository.findByFechaInicioBetween(desde, hasta);
        } else {
            lista = repository.findAll();
        }

        return lista.stream()
                .map(mapper::toResponse)
                .map(this::enriquecerResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ContratoResponse obtener(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .map(this::enriquecerResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato no encontrado: " + id));
    }

    @Override
    @Transactional
    public ContratoResponse formalizarContrato(ContratoRequest request) {
        huespedService.obtener(request.getHuespedId());
        HabitacionResponse habitacion = habitacionService.obtener(request.getHabitacionId());
        
        TipoContrato tipo = null;
        if (request.getTipoContratoId() != null) {
            tipo = tipoContratoRepository.findById(request.getTipoContratoId()).orElse(null);
        }
        if (tipo == null) {
            tipo = tipoContratoRepository.findAll().stream().findFirst().orElseGet(() ->
                tipoContratoRepository.save(TipoContrato.builder()
                        .nombre("Contrato Semestral (6 meses)")
                        .duracionMeses(6)
                        .penalidadIncumplimiento(true)
                        .build())
            );
        }

        habitacionService.bloquearHabitacion(request.getHabitacionId());

        String codigo = "CTR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        LocalDate fechaInicio = request.getFechaInicio() != null ? request.getFechaInicio() : LocalDate.now();
        LocalDate fechaFin = request.getFechaFin();
        if (fechaFin == null) {
            int duracion = tipo.getDuracionMeses() != null ? tipo.getDuracionMeses() : 6;
            fechaFin = fechaInicio.plusMonths(duracion);
        }
        
        ContratoResidencia contrato = ContratoResidencia.builder()
                .codigoContrato(codigo)
                .huespedId(request.getHuespedId())
                .habitacionId(request.getHabitacionId())
                .tipoContratoId(tipo.getId())
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .estado("VIGENTE")
                .build();

        BigDecimal total = BigDecimal.ZERO;
        boolean tieneGarantia = false;

        if (request.getDetalles() != null) {
            for (DetalleContratoDTO detDTO : request.getDetalles()) {
                if (detDTO.getConcepto().toLowerCase().contains("garant") || detDTO.getConcepto().toLowerCase().contains("adelanto")) {
                    tieneGarantia = true;
                }
                BigDecimal subtotal = detDTO.getPrecioUnitario().multiply(BigDecimal.valueOf(detDTO.getCantidad()));
                DetalleContrato detalle = DetalleContrato.builder()
                        .concepto(detDTO.getConcepto())
                        .cantidad(detDTO.getCantidad())
                        .precioUnitario(detDTO.getPrecioUnitario())
                        .subtotal(subtotal)
                        .build();
                contrato.agregarDetalle(detalle);
                total = total.add(subtotal);
            }
        }
        
        if (!tieneGarantia) {
            // Fuerza la creación de la garantía (2 meses de adelantado)
            BigDecimal precioMensual = habitacion.getPrecio();
            BigDecimal subtotalGarantia = precioMensual.multiply(BigDecimal.valueOf(2));
            DetalleContrato garantia = DetalleContrato.builder()
                    .concepto("Garantía Obligatoria por Daños e Incumplimiento (2 meses)")
                    .cantidad(2)
                    .precioUnitario(precioMensual)
                    .subtotal(subtotalGarantia)
                    .build();
            contrato.agregarDetalle(garantia);
            total = total.add(subtotalGarantia);
        }

        contrato.setTotalContrato(total);

        ContratoResidencia guardado = repository.save(contrato);
        return enriquecerResponse(mapper.toResponse(guardado));
    }

    private ContratoResponse enriquecerResponse(ContratoResponse resp) {
        if (resp == null) return null;
        if (resp.getHuespedId() != null) {
            try {
                var h = huespedService.obtener(resp.getHuespedId());
                if (h != null) {
                    resp.setHuespedNombre(h.getNombreCompleto());
                    resp.setHuespedDni(h.getNumeroDocumento());
                }
            } catch (Exception ignored) {}
        }
        if (resp.getHabitacionId() != null) {
            try {
                var hab = habitacionService.obtener(resp.getHabitacionId());
                if (hab != null) {
                    resp.setHabitacionNumero(hab.getNumero());
                    resp.setHabitacionTipo(hab.getTipoHabitacionNombre());
                    resp.setHabitacionPrecio(hab.getPrecio());
                }
            } catch (Exception ignored) {}
        }
        if (resp.getTipoContratoId() != null) {
            try {
                var tipo = tipoContratoRepository.findById(resp.getTipoContratoId()).orElse(null);
                if (tipo != null) {
                    resp.setTipoContratoNombre(tipo.getNombre());
                }
            } catch (Exception ignored) {}
        }
        return resp;
    }

    @Override
    @Transactional
    public void anularContrato(Long id) {
        ContratoResidencia contrato = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato no encontrado: " + id));
        if ("ANULADO".equalsIgnoreCase(contrato.getEstado())) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.CONFLICT, "El contrato ya se encuentra anulado");
        }
        contrato.setEstado("ANULADO");
        repository.save(contrato);

        habitacionService.liberarHabitacion(contrato.getHabitacionId());
    }
}