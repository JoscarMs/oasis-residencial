package pe.edu.upeu.oasis.contratos.contrato.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.contratos.contrato.dto.TipoContratoRequest;
import pe.edu.upeu.oasis.contratos.contrato.dto.TipoContratoResponse;
import pe.edu.upeu.oasis.contratos.contrato.entity.TipoContrato;
import pe.edu.upeu.oasis.contratos.contrato.mapper.TipoContratoMapper;
import pe.edu.upeu.oasis.contratos.contrato.repository.TipoContratoRepository;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoContratoService {
    private final TipoContratoRepository repository;
    private final TipoContratoMapper mapper;

    @Transactional(readOnly = true)
    public List<TipoContratoResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional
    public TipoContratoResponse crear(TipoContratoRequest request) {
        if(request.getPenalidadIncumplimiento() == null) request.setPenalidadIncumplimiento(true);
        TipoContrato entity = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entity));
    }

    @Transactional
    public TipoContratoResponse actualizar(Long id, TipoContratoRequest request) {
        TipoContrato entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No encontrado"));
        mapper.updateEntityFromRequest(request, entity);
        return mapper.toResponse(repository.save(entity));
    }
}