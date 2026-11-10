package pe.edu.upeu.oasis.seguridad.cuenta.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioRequest;
import pe.edu.upeu.oasis.seguridad.cuenta.dto.CuentaUsuarioResponse;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.CuentaUsuario;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.RegistroAuditoria;
import pe.edu.upeu.oasis.seguridad.cuenta.mapper.CuentaUsuarioMapper;
import pe.edu.upeu.oasis.seguridad.cuenta.repository.CuentaUsuarioRepository;
import pe.edu.upeu.oasis.seguridad.cuenta.repository.RegistroAuditoriaRepository;

import pe.edu.upeu.oasis.residentes.huesped.repository.HuespedRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentaUsuarioServiceImpl implements CuentaUsuarioService {
    private final CuentaUsuarioRepository repository;
    private final RegistroAuditoriaRepository auditoriaRepository;
    private final CuentaUsuarioMapper mapper;
    private final HuespedRepository huespedRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<CuentaUsuarioResponse> listar() {
        return repository.findAll().stream().map(this::enriquecer).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CuentaUsuarioResponse obtener(Long id) {
        return repository.findById(id).map(this::enriquecer)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + id));
    }

    @Override
    @Transactional
    public CuentaUsuarioResponse crear(CuentaUsuarioRequest request) {
        CuentaUsuario entity = mapper.toEntity(request);
        entity.setActivo(true);
        if (entity.getRol() == null || entity.getRol().isBlank()) {
            entity.setRol("ROLE_RESIDENTE");
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            entity.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            entity.setPasswordInicial(request.getPassword());
        } else {
            entity.setPasswordHash(passwordEncoder.encode("123456"));
            entity.setPasswordInicial("123456");
        }
        return enriquecer(repository.save(entity));
    }

    @Override
    @Transactional
    public void desactivar(Long id) {
        CuentaUsuario entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + id));
        entity.setActivo(false);
        repository.save(entity);
    }

    @Override
    @Transactional
    public void toggleActivo(Long id) {
        CuentaUsuario entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + id));
        entity.setActivo(!Boolean.TRUE.equals(entity.getActivo()));
        repository.save(entity);
    }

    @Override
    @Transactional
    public CuentaUsuarioResponse resetPassword(Long id) {
        CuentaUsuario entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + id));
        String passBase = "123456";
        entity.setPasswordHash(passwordEncoder.encode(passBase));
        entity.setPasswordInicial(passBase);
        return enriquecer(repository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistroAuditoria> listarAuditoriaReciente() {
        return auditoriaRepository.findTop50ByOrderByTimestampDesc();
    }

    private CuentaUsuarioResponse enriquecer(CuentaUsuario c) {
        CuentaUsuarioResponse resp = mapper.toResponse(c);
        resp.setPasswordInicial(c.getPasswordInicial() != null ? c.getPasswordInicial() : "123456");
        if (c.getHuespedId() != null) {
            huespedRepository.findById(c.getHuespedId()).ifPresent(h -> {
                resp.setNombreCompleto(h.getNombreCompleto());
                resp.setNumeroDocumento(h.getNumeroDocumento());
            });
        }
        return resp;
    }
}
