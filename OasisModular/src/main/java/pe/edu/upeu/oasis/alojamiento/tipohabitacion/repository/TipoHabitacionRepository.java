package pe.edu.upeu.oasis.alojamiento.tipohabitacion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.entity.TipoHabitacion;

public interface TipoHabitacionRepository extends JpaRepository<TipoHabitacion, Long> {
}
