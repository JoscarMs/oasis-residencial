package pe.edu.upeu.oasis.seguridad.cuenta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.CuentaUsuario;
import java.util.Optional;

public interface CuentaUsuarioRepository extends JpaRepository<CuentaUsuario, Long> {
    Optional<CuentaUsuario> findByUsername(String username);
}
