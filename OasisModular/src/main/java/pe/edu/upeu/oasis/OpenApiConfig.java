package pe.edu.upeu.oasis;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String ESQUEMA_JWT = "bearerAuth";

    @Bean
    OpenAPI oasisOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("OASIS Residencia Modular API")
                        .version("v1")
                        .description("API RESTful para la gestión integral de la Residencia Habitacional Mixta OASIS protegida con Keycloak.")
                        .contact(new Contact().name("Equipo Oasis: José Carlos Mena Sarmiento & Ronald Alex Solorzano Saya")))
                .components(new Components().addSecuritySchemes(ESQUEMA_JWT,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList(ESQUEMA_JWT));
    }
}
