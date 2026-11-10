package pe.edu.upeu.oasis.pagos.pago.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.pagos.pago.dto.ServicioExtraDTO;
import pe.edu.upeu.oasis.pagos.pago.entity.ServicioExtra;
import pe.edu.upeu.oasis.pagos.pago.repository.ServicioExtraRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicioExtraService {
    private final ServicioExtraRepository repository;

    @Transactional(readOnly = true)
    public List<ServicioExtraDTO> listarActivos() {
        return repository.findByActivoTrueOrderByIdAsc().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServicioExtraDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServicioExtraDTO obtenerPorId(Long id) {
        ServicioExtra entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio extra no encontrado con ID: " + id));
        return toDTO(entity);
    }

    @Transactional
    public ServicioExtraDTO crear(ServicioExtraDTO dto) {
        ServicioExtra entity = ServicioExtra.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .categoria(dto.getCategoria() != null ? dto.getCategoria() : "GENERAL")
                .icono(dto.getIcono() != null ? dto.getIcono() : "✨")
                .unidad(dto.getUnidad() != null ? dto.getUnidad() : "Por Servicio")
                .precioMensual(dto.getPrecio())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        return toDTO(repository.save(entity));
    }

    @Transactional
    public ServicioExtraDTO actualizar(Long id, ServicioExtraDTO dto) {
        ServicioExtra entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio extra no encontrado con ID: " + id));
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setCategoria(dto.getCategoria());
        entity.setIcono(dto.getIcono());
        entity.setUnidad(dto.getUnidad());
        entity.setPrecioMensual(dto.getPrecio());
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

    private ServicioExtraDTO toDTO(ServicioExtra e) {
        return ServicioExtraDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .categoria(e.getCategoria())
                .icono(e.getIcono())
                .unidad(e.getUnidad())
                .precio(e.getPrecioMensual())
                .activo(e.getActivo())
                .build();
    }
}
