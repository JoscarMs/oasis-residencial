export const environment = {
  production: true,
  apiBaseUrl: 'https://api.oasis.upeu.edu.pe',
  keycloak: {
    issuer: 'https://auth.oasis.upeu.edu.pe/realms/oasis',
    clientId: 'oasis-frontend',
    redirectUri: 'https://oasis.upeu.edu.pe/auth/callback',
    postLogoutRedirectUri: 'https://oasis.upeu.edu.pe/',
  },
};
