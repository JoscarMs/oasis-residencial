export const environment = {
  apiBaseUrl: 'http://localhost:8080',
  keycloak: {
    issuer: 'http://localhost:38080/realms/oasis',
    clientId: 'oasis-frontend',
    redirectUri: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/',
  },
};
