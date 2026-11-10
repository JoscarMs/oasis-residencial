package pe.edu.upeu.oasis.comunicacion.actividad.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadRequest;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadResponse;
import pe.edu.upeu.oasis.comunicacion.actividad.entity.ActividadComunitaria;
import pe.edu.upeu.oasis.comunicacion.actividad.mapper.ActividadMapper;
import pe.edu.upeu.oasis.comunicacion.actividad.repository.ActividadRepository;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActividadServiceImpl implements ActividadService {
    private final ActividadRepository repository;
    private final ActividadMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<ActividadResponse> listarActivos() {
        return repository.findByActivoTrueOrderByFijadoDescFechaPublicacionDesc()
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ActividadResponse obtener(Long id) {
        return repository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("actividad no encontrado: " + id));
    }

    @Override
    @Transactional
    public ActividadResponse publicar(ActividadRequest request) {
        ActividadComunitaria entity = mapper.toEntity(request);
        entity.setFechaPublicacion(LocalDate.now());
        entity.setActivo(true);
        if (entity.getFijado() == null) {
            entity.setFijado(false);
        }
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public ActividadResponse actualizar(Long id, ActividadRequest request) {
        ActividadComunitaria entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("actividad no encontrado: " + id));
        mapper.updateEntityFromRequest(request, entity);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        ActividadComunitaria entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("actividad no encontrado: " + id));
        entity.setActivo(false);
        repository.save(entity);
    }
}

