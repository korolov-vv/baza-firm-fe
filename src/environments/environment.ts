export const environment = {
  production: false,
  apiUrl: 'http://baza-firm-be.internal:8082/api',
  keycloak: {
    url: 'https://keycloak-bazafirm.fly.dev',
    realm: 'bazafirm-customer',
    clientId: 'customer-app-web'
  }
};