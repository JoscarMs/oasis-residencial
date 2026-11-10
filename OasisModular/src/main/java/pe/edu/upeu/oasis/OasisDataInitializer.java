package pe.edu.upeu.oasis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.oasis.alojamiento.habitacion.entity.Habitacion;
import pe.edu.upeu.oasis.alojamiento.habitacion.repository.HabitacionRepository;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.entity.TipoHabitacion;
import pe.edu.upeu.oasis.alojamiento.tipohabitacion.repository.TipoHabitacionRepository;
import pe.edu.upeu.oasis.comunicacion.actividad.entity.ActividadComunitaria;
import pe.edu.upeu.oasis.comunicacion.actividad.repository.ActividadRepository;
import pe.edu.upeu.oasis.contratos.contrato.entity.ContratoResidencia;
import pe.edu.upeu.oasis.contratos.contrato.entity.DetalleContrato;
import pe.edu.upeu.oasis.contratos.contrato.repository.ContratoRepository;
import pe.edu.upeu.oasis.contratos.contrato.repository.TipoContratoRepository;
import pe.edu.upeu.oasis.contratos.contrato.entity.TipoContrato;
import pe.edu.upeu.oasis.contratos.contrato.repository.DetalleContratoRepository;
import pe.edu.upeu.oasis.pagos.pago.entity.Pago;
import pe.edu.upeu.oasis.pagos.pago.entity.ServicioExtra;
import pe.edu.upeu.oasis.pagos.pago.repository.ServicioExtraRepository;
import pe.edu.upeu.oasis.pagos.pago.repository.PagoRepository;
import pe.edu.upeu.oasis.residentes.huesped.entity.ContactoApoderado;
import pe.edu.upeu.oasis.residentes.huesped.entity.Huesped;
import pe.edu.upeu.oasis.residentes.huesped.repository.HuespedRepository;
import pe.edu.upeu.oasis.seguridad.cuenta.entity.CuentaUsuario;
import pe.edu.upeu.oasis.seguridad.cuenta.repository.CuentaUsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

import pe.edu.upeu.oasis.contratos.contrato.entity.ConceptoContrato;
import pe.edu.upeu.oasis.contratos.contrato.repository.ConceptoContratoRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
@Profile({"dev", "local"})
@RequiredArgsConstructor
@Slf4j
public class OasisDataInitializer implements CommandLineRunner {

    private final TipoHabitacionRepository tipoHabitacionRepository;
    private final HabitacionRepository habitacionRepository;
    private final HuespedRepository huespedRepository;
    private final ContratoRepository contratoRepository;
    private final TipoContratoRepository tipoContratoRepository;
    private final DetalleContratoRepository detalleContratoRepository;
    private final PagoRepository pagoRepository;
    private final ServicioExtraRepository servicioExtraRepository;
    private final ConceptoContratoRepository conceptoContratoRepository;
    private final CuentaUsuarioRepository cuentaUsuarioRepository;
    private final ActividadRepository actividadRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (habitacionRepository.count() >= 24) {
            log.info("Datos de OASIS ya existen en la base de datos ({} habitaciones encontradas). Verificando servicios extras y conceptos...", habitacionRepository.count());
            seedServiciosYConceptosSiFaltan();
            asegurarCuentasUsuarios();
            return;
        }

        log.info("Reiniciando y cargando datos completos de la Residencia OASIS...");
        pagoRepository.deleteAllInBatch();
        servicioExtraRepository.deleteAllInBatch();
        conceptoContratoRepository.deleteAllInBatch();
        detalleContratoRepository.deleteAllInBatch();
        tipoContratoRepository.deleteAllInBatch();
        contratoRepository.deleteAllInBatch();
        tipoContratoRepository.deleteAllInBatch();
        cuentaUsuarioRepository.deleteAllInBatch();
        actividadRepository.deleteAllInBatch();
        habitacionRepository.deleteAllInBatch();
        tipoHabitacionRepository.deleteAllInBatch();
        huespedRepository.deleteAllInBatch();

        // 1. TIPOS DE HABITACIÓN
        TipoHabitacion thNormal = tipoHabitacionRepository.save(TipoHabitacion.builder()
                .nombre("Habitación Normal")
                .descripcion("Habitación estándar de un solo ambiente.")
                .precioBase(new BigDecimal("350.00"))
                .capacidadPersonas(1)
                .build());

        TipoHabitacion thMiniDepa = tipoHabitacionRepository.save(TipoHabitacion.builder()
                .nombre("Minidepartamento")
                .descripcion("Cuenta con cocina, baño, cuarto y pisos.")
                .precioBase(new BigDecimal("600.00"))
                .capacidadPersonas(2)
                .build());

        TipoHabitacion thDepa = tipoHabitacionRepository.save(TipoHabitacion.builder()
                .nombre("Departamento")
                .descripcion("Departamento espacioso para grupos o familias.")
                .precioBase(new BigDecimal("900.00"))
                .capacidadPersonas(4)
                .build());

        // 2. HABITACIONES (4 PISOS: 101-106, 201-206, 301-306, 401-406)
        Map<String, Habitacion> habMap = new HashMap<>();
        for (int piso = 1; piso <= 4; piso++) {
            for (int num = 1; num <= 6; num++) {
                String numeroHab = String.format("%d0%d", piso, num);
                TipoHabitacion tipo;
                BigDecimal precio;
                Boolean amoblada;
                String tipoBano;

                if (num == 1 || num == 2) {
                    tipo = thNormal;
                    precio = new BigDecimal("350.00");
                    amoblada = (num == 1); // La 1 amoblada, la 2 sin amoblar
                    tipoBano = "COMPARTIDO";
                } else if (num == 3 || num == 4) {
                    tipo = thMiniDepa;
                    precio = new BigDecimal("600.00");
                    amoblada = true;
                    tipoBano = "PRIVADO";
                } else {
                    tipo = thDepa;
                    precio = new BigDecimal("900.00");
                    amoblada = (num == 6); // La 6 amoblada, la 5 sin amoblar
                    tipoBano = "PRIVADO";
                }

                Habitacion hab = Habitacion.builder()
                        .numero(numeroHab)
                        .piso(piso)
                        .precio(precio)
                        .estado("DISPONIBLE")
                        .tipoHabitacion(tipo)
                        .amoblada(amoblada)
                        .tipoBano(tipoBano)
                        .build();

                habMap.put(numeroHab, habitacionRepository.save(hab));
            }
        }
        log.info("Se crearon {} habitaciones distribuidas en 4 pisos.", habMap.size());

        // 3. HUÉSPEDES (ESTUDIANTES, MENORES, EGRESADOS, PROFESIONALES EXTERNOS, FAMILIARES, EXTRANJEROS)
        List<Huesped> huespedes = new ArrayList<>();

        // Estudiante mayor de edad (DNI)
        Huesped h1 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Juan Carlos Mena Sarmiento")
                .email("jmena.est@oasis.pe")
                .telefono("987111222")
                .tipoDocumento("DNI")
                .numeroDocumento("71234567")
                .perfil("ESTUDIANTE")
                .esMenorDeEdad(false)
                .build());
        huespedes.add(h1);

        // Estudiante mayor de edad (DNI)
        Huesped h2 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Ronald Alex Solorzano Saya")
                .email("rsolorzano.est@oasis.pe")
                .telefono("987222333")
                .tipoDocumento("DNI")
                .numeroDocumento("72345678")
                .perfil("ESTUDIANTE")
                .esMenorDeEdad(false)
                .build());
        huespedes.add(h2);

        // Estudiante menor de edad (con Apoderado)
        Huesped h3 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Sofia Valentina Morales")
                .email("sofia.morales@oasis.pe")
                .telefono("987333444")
                .tipoDocumento("DNI")
                .numeroDocumento("78901234")
                .perfil("ESTUDIANTE")
                .esMenorDeEdad(true)
                .apoderado(ContactoApoderado.builder()
                        .nombreApoderado("Elena Morales de la Cruz")
                        .telefonoApoderado("955112233")
                        .dniApoderado("09876543")
                        .parentesco("MADRE")
                        .build())
                .build());
        huespedes.add(h3);

        // Estudiante menor de edad (con Apoderado)
        Huesped h4 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Mateo Quispe Mamani")
                .email("mateo.quispe@oasis.pe")
                .telefono("987444555")
                .tipoDocumento("DNI")
                .numeroDocumento("79012345")
                .perfil("ESTUDIANTE")
                .esMenorDeEdad(true)
                .apoderado(ContactoApoderado.builder()
                        .nombreApoderado("Pedro Quispe Condori")
                        .telefonoApoderado("944223344")
                        .dniApoderado("08765432")
                        .parentesco("PADRE")
                        .build())
                .build());
        huespedes.add(h4);

        // Profesional Egresado
        Huesped h5 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Ing. Andrea Ramos Flores")
                .email("andrea.ramos@oasis.pe")
                .telefono("987555666")
                .tipoDocumento("DNI")
                .numeroDocumento("45678901")
                .perfil("PROFESIONAL_EGRESADO")
                .esMenorDeEdad(false)
                .build());
        huespedes.add(h5);

        // Profesional Externo (no de la misma universidad)
        Huesped h6 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Lic. Fernando Torres Chávez")
                .email("fernando.torres@empresa.pe")
                .telefono("987666777")
                .tipoDocumento("DNI")
                .numeroDocumento("46789012")
                .perfil("PROFESIONAL_EXTERNO")
                .esMenorDeEdad(false)
                .build());
        huespedes.add(h6);

        // Familiar del dueño
        Huesped h7 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Maria del Carmen Sarmiento")
                .email("carmen.sarmiento@oasis.pe")
                .telefono("987777888")
                .tipoDocumento("DNI")
                .numeroDocumento("07891234")
                .perfil("FAMILIAR_DUENIO")
                .esMenorDeEdad(false)
                .build());
        huespedes.add(h7);

        // Extranjero con Pasaporte
        Huesped h8 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Lucas David Silva")
                .email("lucas.silva@usp.br")
                .telefono("+55119998877")
                .tipoDocumento("PASAPORTE")
                .numeroDocumento("BR9876543")
                .perfil("ESTUDIANTE")
                .esMenorDeEdad(false)
                .build());
        huespedes.add(h8);

        // Estudiante universitario regular
        Huesped h9 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Camila Lucía Herrera")
                .email("camila.herrera@oasis.pe")
                .telefono("987888999")
                .tipoDocumento("DNI")
                .numeroDocumento("73456789")
                .perfil("ESTUDIANTE")
                .esMenorDeEdad(false)
                .build());
        huespedes.add(h9);

        // Profesional Externo (Médico residente)
        Huesped h10 = huespedRepository.save(Huesped.builder()
                .nombreCompleto("Dr. Diego Armando Mendoza")
                .email("dmendoza@minsa.gob.pe")
                .telefono("987999000")
                .tipoDocumento("DNI")
                .numeroDocumento("43210987")
                .perfil("PROFESIONAL_EXTERNO")
                .esMenorDeEdad(false)
                .build());
        huespedes.add(h10);

        log.info("Se crearon {} huéspedes con diversos perfiles y documentos.", huespedes.size());

        // 4. USUARIOS DEL SISTEMA (ADMINS, EMPLEADOS, RESIDENTES)
        crearCuentasIniciales(huespedes);

                // 4.5 TIPOS DE CONTRATO
        TipoContrato tipo6Meses = tipoContratoRepository.save(TipoContrato.builder().nombre("Contrato 6 Meses").duracionMeses(6).penalidadIncumplimiento(true).build());
        TipoContrato tipo1Ano = tipoContratoRepository.save(TipoContrato.builder().nombre("Contrato 1 Año").duracionMeses(12).penalidadIncumplimiento(true).build());
        TipoContrato tipo2Anos = tipoContratoRepository.save(TipoContrato.builder().nombre("Contrato 2 Años").duracionMeses(24).penalidadIncumplimiento(true).build());
        log.info("Se crearon 3 tipos de contrato.");

                // 4.6 SERVICIOS EXTRAS Y CONCEPTOS DE CONTRATO
        seedServiciosYConceptosSiFaltan();

        // 5. CONTRATOS DE RESIDENCIA
        // Configuramos contratos vigentes desde el 1 de enero de 2026 hasta el 31 de diciembre de 2026
        List<Object[]> contratosConfig = List.of(
                new Object[]{h1, "101", new BigDecimal("350.00"), LocalDate.of(2026, 1, 1), 9, tipo1Ano}, 
                new Object[]{h2, "201", new BigDecimal("350.00"), LocalDate.of(2026, 1, 1), 9, tipo2Anos},
                new Object[]{h5, "106", new BigDecimal("650.00"), LocalDate.of(2026, 1, 1), 9, tipo6Meses},
                new Object[]{h6, "206", new BigDecimal("650.00"), LocalDate.of(2026, 1, 1), 9, tipo1Ano},
                new Object[]{h7, "102", new BigDecimal("350.00"), LocalDate.of(2026, 1, 1), 9, tipo1Ano},
                new Object[]{h8, "301", new BigDecimal("350.00"), LocalDate.of(2026, 1, 1), 9, tipo1Ano},
                new Object[]{h3, "302", new BigDecimal("350.00"), LocalDate.of(2026, 3, 1), 7, tipo1Ano},
                new Object[]{h4, "401", new BigDecimal("350.00"), LocalDate.of(2026, 3, 1), 7, tipo1Ano},
                new Object[]{h9, "202", new BigDecimal("350.00"), LocalDate.of(2026, 2, 1), 8, tipo6Meses},
                new Object[]{h10, "306", new BigDecimal("650.00"), LocalDate.of(2026, 1, 1), 9, tipo2Anos}
        );
        int totalPagosGenerados = 0;
        int contratoIndex = 1;

        String[] metodos = {"YAPE", "PLIN", "TRANSFERENCIA", "EFECTIVO"};
        Random random = new Random(42);

        for (Object[] cfg : contratosConfig) {
            Huesped huesped = (Huesped) cfg[0];
            String numHab = (String) cfg[1];
            BigDecimal precioMensual = (BigDecimal) cfg[2];
            LocalDate fInicio = (LocalDate) cfg[3];
            int mesesPagados = (Integer) cfg[4];
            TipoContrato tipoContrato = (TipoContrato) cfg[5];

            Habitacion hab = habMap.get(numHab);
            hab.setEstado("OCUPADO");
            habitacionRepository.save(hab);

            String codigoContrato = String.format("CTR-2026-%04d", contratoIndex++);
            BigDecimal totalAlquiler = precioMensual.multiply(new BigDecimal(tipoContrato.getDuracionMeses()));
            BigDecimal totalGarantia = precioMensual.multiply(new BigDecimal("2"));
            BigDecimal totalContrato = totalAlquiler.add(totalGarantia);

            LocalDate fFin = fInicio.plusMonths(tipoContrato.getDuracionMeses());

            ContratoResidencia contrato = ContratoResidencia.builder()
                    .codigoContrato(codigoContrato)
                    .huespedId(huesped.getId())
                    .habitacionId(hab.getId())
                    .tipoContratoId(tipoContrato.getId())
                    .fechaInicio(fInicio)
                    .fechaFin(fFin)
                    .totalContrato(totalContrato)
                    .estado("VIGENTE")
                    .build();

            contrato.agregarDetalle(DetalleContrato.builder()
                    .concepto("Alquiler (" + tipoContrato.getNombre() + ")")
                    .cantidad(tipoContrato.getDuracionMeses())
                    .precioUnitario(precioMensual)
                    .subtotal(totalAlquiler)
                    .build());

            contrato.agregarDetalle(DetalleContrato.builder()
                    .concepto("Garantía Obligatoria por Daños e Incumplimiento (2 meses)")
                    .cantidad(2)
                    .precioUnitario(precioMensual)
                    .subtotal(totalGarantia)
                    .build());

            contrato = contratoRepository.save(contrato);

            String metodoGarantia = metodos[random.nextInt(metodos.length)];
            pagoRepository.save(Pago.builder()
                    .contratoId(contrato.getId())
                    .monto(totalGarantia)
                    .fechaPago(fInicio)
                    .metodoPago(metodoGarantia)
                    .estado("PAGADO")
                    .numeroComprobante("GAR-" + System.currentTimeMillis() % 100000)
                    .build());

            boolean tieneInternet = random.nextBoolean();
            boolean tieneCochera = random.nextBoolean();
            BigDecimal extraMensual = BigDecimal.ZERO;
            if(tieneInternet) extraMensual = extraMensual.add(new BigDecimal("50.00"));
            if(tieneCochera) extraMensual = extraMensual.add(new BigDecimal("120.00"));

            for (int i = 0; i < mesesPagados; i++) {
                LocalDate fechaMensual = fInicio.plusMonths(i);
                String metodoMes = metodos[random.nextInt(metodos.length)];
                BigDecimal montoAPagar = precioMensual.add(extraMensual);
                pagoRepository.save(Pago.builder()
                        .contratoId(contrato.getId())
                        .monto(montoAPagar)
                        .fechaPago(fechaMensual.plusDays(random.nextInt(5)))
                        .metodoPago(metodoMes)
                        .estado("PAGADO")
                        .numeroComprobante("REC-" + System.currentTimeMillis() % 100000)
                        .build());
                totalPagosGenerados++;
            }
        }

        
        log.info("Se crearon {} contratos de residencia y {} pagos registrados desde enero 2026.",
                contratosConfig.size(), totalPagosGenerados);

        // 7. ACTIVIDADES COMUNITARIAS
        List<ActividadComunitaria> actividades = List.of(
                ActividadComunitaria.builder()
                        .titulo("Bienvenida Oficial - Ciclo Residencial OASIS 2026")
                        .contenido("Damos una cordial bienvenida a todos los estudiantes. Recordamos que contamos con áreas de estudio 24/7 y terraza común.")
                        .categoria("COMUNICADO")
                        .fechaPublicacion(LocalDate.of(2026, 1, 10))
                        .fijado(true)
                        .activo(true)
                        .build(),
                ActividadComunitaria.builder()
                        .titulo("Cocina Grupal de Fin de Mes")
                        .contenido("Invitamos a todos los residentes a nuestra cocina grupal este sábado en la terraza. ¡Trae tus mejores recetas!")
                        .categoria("EVENTO")
                        .fechaPublicacion(LocalDate.of(2026, 2, 25))
                        .fijado(true)
                        .activo(true)
                        .build(),
                ActividadComunitaria.builder()
                        .titulo("Noche de Películas y Pizza")
                        .contenido("Este viernes nos reuniremos en la sala común para una maratón de películas. La administración pone las pizzas.")
                        .categoria("EVENTO")
                        .fechaPublicacion(LocalDate.of(2026, 4, 15))
                        .fijado(false)
                        .activo(true)
                        .build(),
                ActividadComunitaria.builder()
                        .titulo("Torneo de Deportes y Juegos de Mesa")
                        .contenido("El domingo por la mañana tendremos partidos en la losa deportiva y juegos de mesa en la tarde. ¡Habrá premios!")
                        .categoria("EVENTO")
                        .fechaPublicacion(LocalDate.of(2026, 8, 20))
                        .fijado(false)
                        .activo(true)
                        .build()
        );
        actividadRepository.saveAll(actividades);
        log.info("Se crearon {} actividades comunitarias.", actividades.size());

        log.info("¡Carga inicial de datos para OASIS completada exitosamente!");
    }

    private void seedServiciosYConceptosSiFaltan() {
        if (servicioExtraRepository.count() < 8) {
            log.info("Sembrando catálogo enriquecido de servicios extras para OASIS...");
            List<ServicioExtra> servicios = List.of(
                ServicioExtra.builder()
                    .nombre("Lavandería Express")
                    .descripcion("Carga de lavado y secado completo (hasta 8 kg de ropa)")
                    .categoria("Limpieza")
                    .icono("🧺")
                    .unidad("Carga")
                    .precioMensual(new BigDecimal("15.00"))
                    .activo(true)
                    .build(),
                ServicioExtra.builder()
                    .nombre("Limpieza Profunda de Habitación")
                    .descripcion("Desinfección integral de piso, baño privado, muebles y cambio de sábanas")
                    .categoria("Limpieza")
                    .icono("🧹")
                    .unidad("Sesión")
                    .precioMensual(new BigDecimal("25.00"))
                    .activo(true)
                    .build(),
                ServicioExtra.builder()
                    .nombre("Cochera Techada y Segura")
                    .descripcion("Espacio vigilado 24/7 con portón automatizado para auto, moto o bicicleta")
                    .categoria("Estacionamiento")
                    .icono("🚗")
                    .unidad("Mes")
                    .precioMensual(new BigDecimal("80.00"))
                    .activo(true)
                    .build(),
                ServicioExtra.builder()
                    .nombre("Alquiler de Frigobar Ejecutivo")
                    .descripcion("Frigobar personal silencioso con congelador para la habitación")
                    .categoria("Equipamiento")
                    .icono("🧊")
                    .unidad("Mes")
                    .precioMensual(new BigDecimal("60.00"))
                    .activo(true)
                    .build(),
                ServicioExtra.builder()
                    .nombre("Alquiler de Microondas Digital")
                    .descripcion("Horno microondas de 20 litros instalado en la habitación")
                    .categoria("Equipamiento")
                    .icono("♨️")
                    .unidad("Mes")
                    .precioMensual(new BigDecimal("35.00"))
                    .activo(true)
                    .build(),
                ServicioExtra.builder()
                    .nombre("Conexión Dedicada Fibra Óptica 5G")
                    .descripcion("Ancho de banda garantizado de 200 Mbps con baja latencia para streaming y estudios")
                    .categoria("Tecnología")
                    .icono("🌐")
                    .unidad("Mes")
                    .precioMensual(new BigDecimal("45.00"))
                    .activo(true)
                    .build(),
                ServicioExtra.builder()
                    .nombre("Recarga de Bidón de Agua Purificada (20L)")
                    .descripcion("Agua tratada ozonizada llevada directamente a la puerta de tu habitación")
                    .categoria("Alimentación")
                    .icono("💧")
                    .unidad("Bidón")
                    .precioMensual(new BigDecimal("12.00"))
                    .activo(true)
                    .build(),
                ServicioExtra.builder()
                    .nombre("Pack Impresiones y Copias Académicas")
                    .descripcion("Paquete mensual de 100 impresiones B/N y 20 a color en recepción")
                    .categoria("Académico")
                    .icono("🖨️")
                    .unidad("Pack")
                    .precioMensual(new BigDecimal("20.00"))
                    .activo(true)
                    .build(),
                ServicioExtra.builder()
                    .nombre("Custodia y Almacén de Maletas")
                    .descripcion("Almacenamiento seguro de equipaje durante vacaciones intersemestrales")
                    .categoria("Almacén")
                    .icono("📦")
                    .unidad("Mes")
                    .precioMensual(new BigDecimal("50.00"))
                    .activo(true)
                    .build()
            );
            servicioExtraRepository.saveAll(servicios);
            log.info("Se sembraron {} servicios extras en el catálogo.", servicios.size());
        }

        if (conceptoContratoRepository.count() == 0) {
            log.info("Sembrando conceptos dinámicos de contrato para OASIS...");
            List<ConceptoContrato> conceptos = List.of(
                ConceptoContrato.builder()
                    .nombre("Garantía Obligatoria (2 meses)")
                    .descripcion("Depósito de garantía por posibles daños a la habitación o incumplimiento, reembolsable.")
                    .precioSugerido(new BigDecimal("700.00"))
                    .categoria("GARANTIA")
                    .icono("🛡️")
                    .activo(true)
                    .build(),
                ConceptoContrato.builder()
                    .nombre("Garantía Simple (1 mes)")
                    .descripcion("Depósito de garantía equivalente a 1 mes de estancia.")
                    .precioSugerido(new BigDecimal("350.00"))
                    .categoria("GARANTIA")
                    .icono("🛡️")
                    .activo(true)
                    .build(),
                ConceptoContrato.builder()
                    .nombre("Internet Fibra Óptica Alta Velocidad")
                    .descripcion("Conexión de alta velocidad con router de doble banda en habitación.")
                    .precioSugerido(new BigDecimal("50.00"))
                    .categoria("SERVICIO")
                    .icono("🌐")
                    .activo(true)
                    .build(),
                ConceptoContrato.builder()
                    .nombre("Cochera Vehicular Techada")
                    .descripcion("Plaza reservada en la cochera interna con control de acceso.")
                    .precioSugerido(new BigDecimal("120.00"))
                    .categoria("COCHERA")
                    .icono("🚗")
                    .activo(true)
                    .build(),
                ConceptoContrato.builder()
                    .nombre("Frigobar Ejecutivo en Habitación")
                    .descripcion("Alquiler mensual de frigobar personal de bajo consumo.")
                    .precioSugerido(new BigDecimal("60.00"))
                    .categoria("EQUIPAMIENTO")
                    .icono("🧊")
                    .activo(true)
                    .build(),
                ConceptoContrato.builder()
                    .nombre("Horno Microondas")
                    .descripcion("Alquiler mensual de horno microondas en habitación.")
                    .precioSugerido(new BigDecimal("35.00"))
                    .categoria("EQUIPAMIENTO")
                    .icono("♨️")
                    .activo(true)
                    .build(),
                ConceptoContrato.builder()
                    .nombre("Servicio de Limpieza Quincenal")
                    .descripcion("Limpieza y desinfección quincenal programada de la habitación.")
                    .precioSugerido(new BigDecimal("40.00"))
                    .categoria("SERVICIO")
                    .icono("🧹")
                    .activo(true)
                    .build(),
                ConceptoContrato.builder()
                    .nombre("Custodia de Equipaje en Vacaciones")
                    .descripcion("Almacén y custodia vigilada de pertenencias durante vacaciones.")
                    .precioSugerido(new BigDecimal("50.00"))
                    .categoria("OTRO")
                    .icono("📦")
                    .activo(true)
                    .build()
            );
                        conceptoContratoRepository.saveAll(conceptos);
            log.info("Se sembraron {} conceptos de contrato dinámicos.", conceptos.size());
        }

        if (tipoContratoRepository.count() == 0) {
            log.info("Sembrando catálogo de tipos de contrato para OASIS...");
            tipoContratoRepository.save(TipoContrato.builder().nombre("Contrato Semestral (6 meses)").duracionMeses(6).penalidadIncumplimiento(true).build());
            tipoContratoRepository.save(TipoContrato.builder().nombre("Contrato Anual (12 meses)").duracionMeses(12).penalidadIncumplimiento(true).build());
            tipoContratoRepository.save(TipoContrato.builder().nombre("Contrato Multianual (24 meses)").duracionMeses(24).penalidadIncumplimiento(true).build());
            log.info("Se sembraron 3 tipos de contrato en el catálogo.");
        }
    }

    private void crearCuentasIniciales(List<Huesped> huespedes) {
        String passHash = passwordEncoder.encode("123456");
        List<CuentaUsuario> cuentas = new ArrayList<>();
        cuentas.add(CuentaUsuario.builder().username("admin").passwordHash(passHash).passwordInicial("123456").rol("ROLE_ADMIN").activo(true).build());
        cuentas.add(CuentaUsuario.builder().username("supervisor").passwordHash(passHash).passwordInicial("123456").rol("ROLE_SUPERVISOR").activo(true).build());
        cuentas.add(CuentaUsuario.builder().username("recepcion").passwordHash(passHash).passwordInicial("123456").rol("ROLE_RECEPCIONISTA").activo(true).build());

        for (Huesped h : huespedes) {
            cuentas.add(CuentaUsuario.builder()
                    .username(h.getNumeroDocumento())
                    .passwordHash(passHash)
                    .passwordInicial("123456")
                    .rol("ROLE_RESIDENTE")
                    .huespedId(h.getId())
                    .activo(true)
                    .build());
        }
        cuentaUsuarioRepository.saveAll(cuentas);
        log.info("Se crearon {} cuentas de usuario unificadas con clave 123456.", cuentas.size());
    }

    private void asegurarCuentasUsuarios() {
        String passHash = passwordEncoder.encode("123456");
        if (cuentaUsuarioRepository.findByUsername("admin").isEmpty()) {
            cuentaUsuarioRepository.save(CuentaUsuario.builder().username("admin").passwordHash(passHash).passwordInicial("123456").rol("ROLE_ADMIN").activo(true).build());
        }
        if (cuentaUsuarioRepository.findByUsername("supervisor").isEmpty()) {
            cuentaUsuarioRepository.save(CuentaUsuario.builder().username("supervisor").passwordHash(passHash).passwordInicial("123456").rol("ROLE_SUPERVISOR").activo(true).build());
        }
        if (cuentaUsuarioRepository.findByUsername("recepcion").isEmpty()) {
            cuentaUsuarioRepository.save(CuentaUsuario.builder().username("recepcion").passwordHash(passHash).passwordInicial("123456").rol("ROLE_RECEPCIONISTA").activo(true).build());
        }

        for (Huesped h : huespedRepository.findAll()) {
            if (cuentaUsuarioRepository.findByUsername(h.getNumeroDocumento()).isEmpty()) {
                cuentaUsuarioRepository.save(CuentaUsuario.builder()
                        .username(h.getNumeroDocumento())
                        .passwordHash(passHash)
                        .passwordInicial("123456")
                        .rol("ROLE_RESIDENTE")
                        .huespedId(h.getId())
                        .activo(true)
                        .build());
            }
        }
        log.info("Verificación de cuentas de usuario completada con contraseña inicial 123456.");
    }

}
