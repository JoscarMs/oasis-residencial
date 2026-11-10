package pe.edu.upeu.oasis.contratos.contrato.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.contratos.contrato.entity.TipoContrato;

public interface TipoContratoRepository extends JpaRepository<TipoContrato, Long> {
}