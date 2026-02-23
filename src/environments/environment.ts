export const environment = {
  production: false,
  apiUrl: 'https://bazafirm-be.internal:8082/api',
  keycloak: {
    url: 'http://keycloak-bazafirm.internal:8080',
    realm: 'bazafirm-customer',
    clientId: 'customer-app-web'
  }
};