package pe.edu.upeu.oasis.pagos.pago.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.pagos.pago.entity.ServicioExtra;
import java.util.List;

public interface ServicioExtraRepository extends JpaRepository<ServicioExtra, Long> {
    List<ServicioExtra> findByActivoTrueOrderByIdAsc();
}