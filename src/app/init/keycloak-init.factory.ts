import { KeycloakService } from "keycloak-angular";

export function inizializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'ShareSub',
        clientId: 'ShareSubClient',
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets'],
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
      },
    });
}
