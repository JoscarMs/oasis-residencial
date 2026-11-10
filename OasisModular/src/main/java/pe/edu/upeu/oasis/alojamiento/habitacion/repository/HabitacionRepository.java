package pe.edu.upeu.oasis.alojamiento.habitacion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.alojamiento.habitacion.entity.Habitacion;
import java.util.List;

public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {
    List<Habitacion> findByEstado(String estado);
    List<Habitacion> findByTipoHabitacionId(Long tipoHabitacionId);
}
