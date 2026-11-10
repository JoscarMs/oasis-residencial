package pe.edu.upeu.oasis.mantenimiento.reporte.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.mantenimiento.reporte.entity.ReporteMantenimiento;

import java.util.List;

public interface ReporteRepository extends JpaRepository<ReporteMantenimiento, Long> {
    List<ReporteMantenimiento> findByHuespedIdOrderByFechaReporteDesc(Long huespedId);
    List<ReporteMantenimiento> findAllByOrderByFechaReporteDesc();
}