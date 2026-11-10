package pe.edu.upeu.oasis.contratos.contrato.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.contratos.contrato.entity.ContratoResidencia;
import java.util.List;

public interface ContratoRepository extends JpaRepository<ContratoResidencia, Long> {
    List<ContratoResidencia> findByHuespedId(Long huespedId);
    List<ContratoResidencia> findByHabitacionId(Long habitacionId);
    List<ContratoResidencia> findByEstado(String estado);
    List<ContratoResidencia> findByFechaInicioBetween(java.time.LocalDate desde, java.time.LocalDate hasta);
    List<ContratoResidencia> findByEstadoAndFechaInicioBetween(String estado, java.time.LocalDate desde, java.time.LocalDate hasta);
}
