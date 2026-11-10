# ==============================================================================
# Dockerfile Multi-Stage: OASIS Modular Backend
# Base: Eclipse Temurin Java 21 LTS + Spring Boot 4.0.7
# ==============================================================================

# ------------------------------------------------------------------------------
# Etapa 1: Builder (Compilación y empaquetado JAR)
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /workspace

# Copiar Maven Wrapper y pom.xml para cachear capas de dependencias
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Corregir saltos de línea CRLF de Windows y dar permisos de ejecución
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Descargar dependencias para aprovechar caché de Docker
RUN ./mvnw dependency:go-offline -B || true

# Copiar código fuente
COPY src/ src/

# Compilar y empaquetar artefacto JAR ejecutable (omitiendo tests para agilizar el build)
RUN ./mvnw clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Etapa 2: Runner (Entorno ligero de producción con JRE 21)
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Crear usuario y grupo sin privilegios de root por seguridad
RUN groupadd -r oasis && useradd -r -g oasis -d /app -s /sbin/nologin oasis

# Copiar el artefacto generado desde la etapa builder
COPY --from=builder /workspace/target/*.jar /app/app.jar

# Asignar propiedad de los archivos al usuario no root
RUN chown -R oasis:oasis /app

# Ejecutar como usuario no root
USER oasis

# Exponer el puerto por defecto de Spring Boot
EXPOSE 8080

# Configuración de memoria y flags JVM optimizados para contenedores
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Punto de entrada
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
