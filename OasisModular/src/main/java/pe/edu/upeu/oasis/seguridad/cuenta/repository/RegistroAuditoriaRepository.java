package pe.edu.upeu.oasis.seguridad.cuenta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.RegistroAuditoria;
import java.util.List;

public interface RegistroAuditoriaRepository extends JpaRepository<RegistroAuditoria, Long> {
    List<RegistroAuditoria> findTop50ByOrderByTimestampDesc();
}
