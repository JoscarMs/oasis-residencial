package pe.edu.upeu.oasis.pagos.pago.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.edu.upeu.oasis.pagos.pago.entity.Pago;
import java.time.LocalDate;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByContratoId(Long contratoId);
    List<Pago> findByFechaPagoBetween(LocalDate inicio, LocalDate fin);
    List<Pago> findByUsuarioId(String usuarioId);

    @Query("SELECT p FROM Pago p WHERE (:usuarioId IS NULL OR p.usuarioId = :usuarioId)")
    List<Pago> buscarPorUsuario(@Param("usuarioId") String usuarioId);
}
