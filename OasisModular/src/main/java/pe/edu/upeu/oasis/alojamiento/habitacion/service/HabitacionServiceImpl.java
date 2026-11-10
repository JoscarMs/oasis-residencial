package pe.edu.upeu.oasis.alojamiento.habitacion.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.habitacion.dto.HabitacionResponse;
import pe.edu.upeu.oasis.alojamiento.habitacion.entity.Habitacion;
import pe.edu.upeu.oasis.alojamiento.habitacion.mapper.HabitacionMapper;
import pe.edu.upeu.oasis.alojamiento.habitacion.repository.HabitacionRepository;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.entity.TipoHabitacion;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.repository.TipoHabitacionRepository;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitacionServiceImpl implements HabitacionService {
    private final HabitacionRepository repository;
    private final TipoHabitacionRepository tipoHabitacionRepository;
    private final HabitacionMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<HabitacionResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HabitacionResponse> listar(Long tipoHabitacionId) {
        if (tipoHabitacionId != null && tipoHabitacionId > 0) {
            return repository.findByTipoHabitacionId(tipoHabitacionId).stream().map(mapper::toResponse).toList();
        }
        return listar();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HabitacionResponse> listarDisponibles() {
        return repository.findByEstado("DISPONIBLE").stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HabitacionResponse obtener(Long id) {
        return repository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + id));
    }

    @Override
    @Transactional
    public HabitacionResponse crear(HabitacionRequest request) {
        TipoHabitacion tipo = tipoHabitacionRepository.findById(request.getTipoHabitacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de habitación no encontrado: " + request.getTipoHabitacionId()));
        Habitacion entity = mapper.toEntity(request);
        entity.setTipoHabitacion(tipo);
        if (entity.getEstado() == null || entity.getEstado().isBlank()) {
            entity.setEstado("DISPONIBLE");
        }
        if (entity.getAmoblada() == null) {
            entity.setAmoblada(false);
        }
        if (entity.getTipoBano() == null || entity.getTipoBano().isBlank()) {
            entity.setTipoBano("COMPARTIDO");
        }
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public HabitacionResponse actualizar(Long id, HabitacionRequest request) {
        Habitacion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + id));
        TipoHabitacion tipo = tipoHabitacionRepository.findById(request.getTipoHabitacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de habitación no encontrado: " + request.getTipoHabitacionId()));
        mapper.updateEntityFromRequest(request, entity);
        entity.setTipoHabitacion(tipo);
        if (entity.getAmoblada() == null) {
            entity.setAmoblada(false);
        }
        if (entity.getTipoBano() == null || entity.getTipoBano().isBlank()) {
            entity.setTipoBano("COMPARTIDO");
        }
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Habitación no encontrada: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void bloquearHabitacion(Long id) {
        Habitacion habitacion = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + id));
        habitacion.bloquear();
        repository.save(habitacion);
    }

    @Override
    @Transactional
    public void liberarHabitacion(Long id) {
        Habitacion habitacion = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + id));
        habitacion.liberar();
        repository.save(habitacion);
    }
}
