// Helper function to get environment variables (works in SSR)
const getEnvVar = (key: string, defaultValue: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  return defaultValue;
};

export const environment = {
  production: true,
  apiUrl: getEnvVar('API_URL', 'http://localhost:8080/api'),
  keycloak: {
    url: getEnvVar('KEYCLOAK_URL', 'http://localhost:8082'),
    realm: getEnvVar('KEYCLOAK_REALM', 'bazafirm-customer'),
    clientId: getEnvVar('KEYCLOAK_CLIENT_ID', 'customer-app-web')
  }
};