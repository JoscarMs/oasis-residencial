package pe.edu.upeu.oasis.residentes.huesped.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.exception.ResourceNotFoundException;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedRequest;
import pe.edu.upeu.oasis.residentes.huesped.dto.HuespedResponse;
import pe.edu.upeu.oasis.residentes.huesped.entity.Huesped;
import pe.edu.upeu.oasis.residentes.huesped.mapper.HuespedMapper;
import pe.edu.upeu.oasis.residentes.huesped.repository.HuespedRepository;
import pe.edu.upeu.oasis.residentes.identidad.IdentidadResponse;
import pe.edu.upeu.oasis.residentes.identidad.IdentidadService;

import pe.edu.upeu.oasis.seguridad.cuenta.entity.CuentaUsuario;
import pe.edu.upeu.oasis.seguridad.cuenta.repository.CuentaUsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HuespedServiceImpl implements HuespedService {
    private final HuespedRepository repository;
    private final HuespedMapper mapper;
    private final IdentidadService identidadService;
    private final CuentaUsuarioRepository cuentaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<HuespedResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HuespedResponse obtener(Long id) {
        return repository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Huésped no encontrado: " + id));
    }

    @Override
    @Transactional
    public HuespedResponse crear(HuespedRequest request) {
        if (Boolean.TRUE.equals(request.getEsMenorDeEdad()) && 
            (request.getNombreApoderado() == null || request.getNombreApoderado().isBlank())) {
            throw new IllegalArgumentException("Los huéspedes menores de edad requieren obligatoriamente los datos del apoderado");
        }
        String doc = request.getNumeroDocumento() == null ? "" : request.getNumeroDocumento().trim();
        request.setNumeroDocumento(doc);
        if (repository.findByNumeroDocumento(doc).isPresent()) {
            throw new IllegalStateException("Ya existe un residente registrado con el documento " + doc);
        }

        // Alta rápida: solo con el documento, los datos se obtienen de RENIEC (DNI) o SUNAT (RUC)
        if (request.getNombreCompleto() == null || request.getNombreCompleto().isBlank()) {
            IdentidadResponse id = "RUC".equalsIgnoreCase(request.getTipoDocumento())
                    ? identidadService.consultarRuc(doc)
                    : identidadService.consultarDni(doc);
            request.setNombreCompleto(id.nombreCompleto());
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            request.setEmail(doc + "@sin-correo.oasis");
        }
        Huesped entity = mapper.toEntity(request);
        Huesped guardado = repository.save(entity);

        // Generar automáticamente la cuenta de usuario para el residente con rol ROLE_RESIDENTE y clave inicial 123456
        try {
            if (cuentaRepository.findByUsername(doc).isEmpty()) {
                CuentaUsuario cuenta = CuentaUsuario.builder()
                        .username(doc)
                        .passwordHash(passwordEncoder.encode("123456"))
                        .passwordInicial("123456")
                        .rol("ROLE_RESIDENTE")
                        .huespedId(guardado.getId())
                        .activo(true)
                        .build();
                cuentaRepository.save(cuenta);
                log.info("Cuenta de usuario creada automáticamente para residente DNI: {}", doc);
            }
        } catch (Exception e) {
            log.warn("No se pudo crear automáticamente la cuenta de usuario para {}: {}", doc, e.getMessage());
        }

        return mapper.toResponse(guardado);
    }

    @Override
    @Transactional
    public HuespedResponse actualizar(Long id, HuespedRequest request) {
        Huesped entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Huésped no encontrado: " + id));
        mapper.updateEntityFromRequest(request, entity);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Huésped no encontrado: " + id);
        }
        repository.deleteById(id);
    }
}
