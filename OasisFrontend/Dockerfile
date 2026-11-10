# ==============================================================================
# Dockerfile Multi-Stage: OASIS Frontend (Angular 19 / 22)
# ==============================================================================

# Etapa 1: Compilación de la aplicación Angular
FROM node:20-alpine AS build
WORKDIR /app

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copiar código fuente y compilar para producción
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servidor Web Nginx ligero para producción
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Limpiar archivos por defecto de Nginx
RUN rm -rf ./*

# Copiar distribución generada (SPA Angular)
COPY --from=build /app/dist/oasis-frontend/browser ./
# Soporte si el output está directo en dist/oasis-frontend
RUN if [ ! -f index.html ] && [ -d /app/dist/oasis-frontend ]; then cp -r /app/dist/oasis-frontend/* ./; fi

# Copiar configuración de Nginx con soporte para rutas HTML5 SPA (fallback index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
