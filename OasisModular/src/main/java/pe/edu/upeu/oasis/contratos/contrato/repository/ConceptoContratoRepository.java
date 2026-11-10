package pe.edu.upeu.oasis.contratos.contrato.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.contratos.contrato.entity.ConceptoContrato;
import java.util.List;

public interface ConceptoContratoRepository extends JpaRepository<ConceptoContrato, Long> {
    List<ConceptoContrato> findByActivoTrueOrderByIdAsc();
}
