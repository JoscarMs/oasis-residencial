package pe.edu.upeu.oasis.contratos.contrato.service;

import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoRequest;
import pe.edu.upeu.oasis.contratos.contrato.dto.ContratoResponse;
import java.time.LocalDate;
import java.util.List;

public interface ContratoService {
    List<ContratoResponse> listar();
    List<ContratoResponse> listar(String estado, LocalDate desde, LocalDate hasta);
    ContratoResponse obtener(Long id);
    ContratoResponse formalizarContrato(ContratoRequest request);
    void anularContrato(Long id);
}
