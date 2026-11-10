package pe.edu.upeu.oasis.contratos.contrato.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upeu.oasis.contratos.contrato.entity.DetalleContrato;

public interface DetalleContratoRepository extends JpaRepository<DetalleContrato, Long> {
}
