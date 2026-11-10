package pe.edu.upeu.oasis.residentes.huesped.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.residentes.huesped.entity.Huesped;
import java.util.Optional;

public interface HuespedRepository extends JpaRepository<Huesped, Long> {
    Optional<Huesped> findByNumeroDocumento(String numeroDocumento);
}
