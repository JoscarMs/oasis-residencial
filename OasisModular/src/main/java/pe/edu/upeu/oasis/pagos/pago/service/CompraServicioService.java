package pe.edu.upeu.oasis.pagos.pago.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.pagos.pago.dto.CompraServicioDTO;
import pe.edu.upeu.oasis.pagos.pago.entity.CompraServicio;
import pe.edu.upeu.oasis.pagos.pago.entity.ServicioExtra;
import pe.edu.upeu.oasis.pagos.pago.repository.CompraServicioRepository;
import pe.edu.upeu.oasis.pagos.pago.repository.ServicioExtraRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompraServicioService {
    private final CompraServicioRepository compraRepository;
    private final ServicioExtraRepository servicioRepository;

    @Transactional(readOnly = true)
    public List<CompraServicioDTO> listar(Jwt jwt) {
        if (jwt == null || esAdminOSupervisor(jwt)) {
            return compraRepository.findAllByOrderByFechaSolicitudDesc().stream()
                    .map(this::toDTO)
                    .toList();
        }

        String userId = jwt.getSubject();
        return compraRepository.findByUsuarioIdOrderByFechaSolicitudDesc(userId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public CompraServicioDTO crear(CompraServicioDTO dto, Jwt jwt) {
        ServicioExtra servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + dto.getServicioId()));

        String usuarioId = (jwt != null) ? jwt.getSubject() : dto.getUsuarioId();
        BigDecimal precio = servicio.getPrecioMensual();
        int cant = (dto.getCantidad() != null && dto.getCantidad() > 0) ? dto.getCantidad() : 1;
        BigDecimal total = precio.multiply(BigDecimal.valueOf(cant));

        CompraServicio entity = CompraServicio.builder()
                .servicioId(servicio.getId())
                .servicioNombre(servicio.getNombre())
                .usuarioId(usuarioId)
                .huespedNombre(dto.getHuespedNombre() != null ? dto.getHuespedNombre() : "Residente")
                .habitacionNumero(dto.getHabitacionNumero() != null ? dto.getHabitacionNumero() : "101")
                .cantidad(cant)
                .precioUnitario(precio)
                .total(total)
                .fechaSolicitud(LocalDate.now())
                .notas(dto.getNotas())
                .estado("PENDIENTE")
                .build();

        return toDTO(compraRepository.save(entity));
    }

    @Transactional
    public CompraServicioDTO actualizarEstado(Long id, String nuevoEstado) {
        CompraServicio entity = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud de servicio no encontrada con ID: " + id));
        entity.setEstado(nuevoEstado);
        return toDTO(compraRepository.save(entity));
    }

    private boolean esAdminOSupervisor(Jwt jwt) {
        Object realmAccess = jwt.getClaims().get("realm_access");
        if (realmAccess instanceof java.util.Map<?, ?> map) {
            Object rolesObj = map.get("roles");
            if (rolesObj instanceof Collection<?> roles) {
                return roles.contains("ADMIN") || roles.contains("SUPERVISOR");
            }
        }
        return false;
    }

    private CompraServicioDTO toDTO(CompraServicio e) {
        return CompraServicioDTO.builder()
                .id(e.getId())
                .servicioId(e.getServicioId())
                .servicioNombre(e.getServicioNombre())
                .usuarioId(e.getUsuarioId())
                .huespedNombre(e.getHuespedNombre())
                .habitacionNumero(e.getHabitacionNumero())
                .cantidad(e.getCantidad())
                .precioUnitario(e.getPrecioUnitario())
                .total(e.getTotal())
                .fechaSolicitud(e.getFechaSolicitud())
                .notas(e.getNotas())
                .estado(e.getEstado())
                .build();
    }
}
