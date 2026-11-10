package pe.edu.upeu.oasis.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DatabaseFixer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixOracleColumns() {
        log.info("--- INICIANDO REPARACION DE BASE DE DATOS ORACLE ---");
        try {
            jdbcTemplate.execute("ALTER TABLE OASIS_HABITACION ADD AMOBLADA NUMBER(1,0) DEFAULT 0");
            log.info("Columna AMOBLADA agregada.");
        } catch (Exception e) {
            log.info("Error AMOBLADA: " + e.getMessage());
        }
        
        try {
            jdbcTemplate.execute("ALTER TABLE OASIS_HABITACION ADD TIPO_BANO VARCHAR2(30) DEFAULT 'COMPARTIDO'");
            log.info("Columna TIPO_BANO agregada.");
        } catch (Exception e) {
            log.info("Error TIPO_BANO: " + e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE OASIS_CONTRATO ADD TIPO_CONTRATO_ID NUMBER(19,0)");
            log.info("Columna TIPO_CONTRATO_ID agregada.");
        } catch (Exception e) {
            log.info("Error TIPO_CONTRATO_ID: " + e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE OASIS_PAGO ADD USUARIO_ID VARCHAR2(36)");
            log.info("Columna USUARIO_ID agregada a OASIS_PAGO.");
        } catch (Exception e) {
            log.info("Error USUARIO_ID: " + e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE OASIS_CUENTA ADD PASSWORD_INICIAL VARCHAR2(60)");
            log.info("Columna PASSWORD_INICIAL agregada a OASIS_CUENTA.");
        } catch (Exception e) {
            log.info("Error PASSWORD_INICIAL: " + e.getMessage());
        }
        log.info("--- FIN REPARACION ---");
    }
}