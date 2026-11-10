package pe.edu.upeu.oasis.comunicacion.actividad.service;

import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadRequest;
import pe.edu.upeu.oasis.comunicacion.actividad.dto.ActividadResponse;
import java.util.List;

public interface ActividadService {
    List<ActividadResponse> listarActivos();
    ActividadResponse obtener(Long id);
    ActividadResponse publicar(ActividadRequest request);
    ActividadResponse actualizar(Long id, ActividadRequest request);
    void eliminar(Long id);
}

