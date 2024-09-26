import {Injectable} from "@angular/core";
import {KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class KeycloakOperationService {
  constructor(private keycloak: KeycloakService) {
  }

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  logout(): void {
    this.keycloak.logout();
  }

  getUserProfile(): any {
    return this.keycloak.loadUserProfile();
  }

  isLogged(): boolean {
    return this.keycloak.isLoggedIn();
  }

  login(): void {
    this.keycloak.login();
  }

  getToken(): Promise<string> {
    return this.keycloak.getToken();
  }

  getUsername(): string {
    return this.keycloak.getUsername();
  }


}
