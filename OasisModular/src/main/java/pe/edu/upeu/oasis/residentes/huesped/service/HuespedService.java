package pe.edu.upeu.oasis.residentes.huesped.service;

import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedRequest;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedResponse;
import java.util.List;

public interface HuespedService {
    List<HuespedResponse> listar();
    HuespedResponse obtener(Long id);
    HuespedResponse crear(HuespedRequest request);
    HuespedResponse actualizar(Long id, HuespedRequest request);
    void eliminar(Long id);
}
