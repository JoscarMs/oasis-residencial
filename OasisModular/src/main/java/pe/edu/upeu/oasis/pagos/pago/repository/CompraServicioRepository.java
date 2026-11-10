package pe.edu.upeu.oasis.pagos.pago.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.pagos.pago.entity.CompraServicio;
import java.util.List;

public interface CompraServicioRepository extends JpaRepository<CompraServicio, Long> {
    List<CompraServicio> findAllByOrderByFechaSolicitudDesc();
    List<CompraServicio> findByUsuarioIdOrderByFechaSolicitudDesc(String usuarioId);
}
