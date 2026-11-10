package pe.edu.upeu.oasis.comunicacion.actividad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.comunicacion.actividad.entity.ActividadComunitaria;
import java.util.List;

public interface ActividadRepository extends JpaRepository<ActividadComunitaria, Long> {
    List<ActividadComunitaria> findByActivoTrueOrderByFijadoDescFechaPublicacionDesc();
}

