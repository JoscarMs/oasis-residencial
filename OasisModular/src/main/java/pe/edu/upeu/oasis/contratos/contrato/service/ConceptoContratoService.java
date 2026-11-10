package pe.edu.upeu.oasis.contratos.contrato.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.contratos.contrato.dto.ConceptoContratoDTO;
import pe.edu.upeu.oasis.contratos.contrato.entity.ConceptoContrato;
import pe.edu.upeu.oasis.contratos.contrato.repository.ConceptoContratoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConceptoContratoService {
    private final ConceptoContratoRepository repository;

    @Transactional(readOnly = true)
    public List<ConceptoContratoDTO> listarActivos() {
        return repository.findByActivoTrueOrderByIdAsc().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConceptoContratoDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public ConceptoContratoDTO crear(ConceptoContratoDTO dto) {
        ConceptoContrato entity = ConceptoContrato.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precioSugerido(dto.getPrecioSugerido())
                .categoria(dto.getCategoria() != null ? dto.getCategoria() : "SERVICIO")
                .icono(dto.getIcono() != null ? dto.getIcono() : "📝")
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        return toDTO(repository.save(entity));
    }

    @Transactional
    public ConceptoContratoDTO actualizar(Long id, ConceptoContratoDTO dto) {
        ConceptoContrato entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Concepto de contrato no encontrado con ID: " + id));
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPrecioSugerido(dto.getPrecioSugerido());
        entity.setCategoria(dto.getCategoria());
        entity.setIcono(dto.getIcono());
        if (dto.getActivo() != null) {
            entity.setActivo(dto.getActivo());
        }
        return toDTO(repository.save(entity));
    }

    @Transactional
    public void eliminar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        }
    }

    private ConceptoContratoDTO toDTO(ConceptoContrato e) {
        return ConceptoContratoDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .precioSugerido(e.getPrecioSugerido())
                .categoria(e.getCategoria())
                .icono(e.getIcono())
                .activo(e.getActivo())
                .build();
    }
}
