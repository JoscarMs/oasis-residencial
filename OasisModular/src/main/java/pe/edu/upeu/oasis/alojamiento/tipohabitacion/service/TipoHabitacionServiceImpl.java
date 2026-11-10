package pe.edu.upeu.oasis.alojamiento.tipohabitacion.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto.TipoHabitacionRequest;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.dto.TipoHabitacionResponse;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.entity.TipoHabitacion;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.mapper.TipoHabitacionMapper;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.repository.TipoHabitacionRepository;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TipoHabitacionServiceImpl implements TipoHabitacionService {
    private final TipoHabitacionRepository repository;
    private final TipoHabitacionMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<TipoHabitacionResponse> listar() {
        log.info("Accediendo a base de datos para listar catálogo de tipos de habitación...");
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TipoHabitacionResponse obtener(Long id) {
        return repository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de habitación no encontrado: " + id));
    }

    @Override
    @Transactional
    public TipoHabitacionResponse crear(TipoHabitacionRequest request) {
        TipoHabitacion entity = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public TipoHabitacionResponse actualizar(Long id, TipoHabitacionRequest request) {
        TipoHabitacion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de habitación no encontrado: " + id));
        mapper.updateEntityFromRequest(request, entity);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Tipo de habitación no encontrado: " + id);
        }
        repository.deleteById(id);
    }
}
