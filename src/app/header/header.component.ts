import {Component, OnInit} from '@angular/core';
import {KeycloakOperationService} from "../services/keycloak.service";
import {jwtDecode} from "jwt-decode";
import {NgIf} from "@angular/common";
import {AccountingService} from "../services/accounting/accounting.service";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../entities/user";
import {ProductsService} from "../services/products/products.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NgIf

  ],
  standalone: true,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userProfile: any | null = null;
  logged: boolean | undefined = false;

  constructor(private keyCloakService: KeycloakOperationService, private accountService: AccountingService,
              private productService: ProductsService) {
  }

  ngOnInit(): void {
    if (this.keyCloakService.isLogged()) {
      this.logged = true;
    }
    this.checkLoginMethod()
    this.updateAll()

  }

  email: string = '';
  user!: User ;

  checkLoginMethod(): void {
    if (this.keyCloakService.isLogged()) {
      this.keyCloakService.getToken().then(token => {
        console.log(token);
        try {
          this.userProfile = jwtDecode(token)
          this.email=this.userProfile['email'];
          console.log(this.userProfile);
          console.log(this.email);
        } catch (error) {
          console.error('Errore durante la decodifica del token:', error);
        }
      });

      this.accountService.getAll()
        .subscribe({
          next: (responseMessage) => {
            const users: User[] = responseMessage.object;
            if(users != undefined){
              this.user = users.find(user => user.email === this.email)!;
            }
            if (this.user === undefined) {
              console.log('Utente non trovato, procedo con la creazione');
              console.log(this.userProfile['given_name']);
              console.log(this.userProfile['family_name']);
              this.accountService.registerUserByString(this.email, this.userProfile['given_name'], this.userProfile['family_name'])
                .subscribe({
                  next: (responseMessage) => {
                    console.log(responseMessage);
                  },
                  error: (e) => {
                    console.error('Errore durante la creazione dell\'utente');
                  }
                });
            }
          }
        });

    }

  }

  updateAll(){
    this.productService.updateAll()
      .subscribe({
        next: (responseMessage) => {
          console.log(responseMessage);
        },
        error: (e: HttpErrorResponse) => {
          console.error('Errore durante l\'aggiornamento dei prodotti');
        }
      });
  }

  loginFunction(): void {
    this.keyCloakService.login();
  }

  logout(): void {
    this.keyCloakService.logout();
    this.userProfile = null;
    this.email = '';
    //wait 2 seconds before back to home
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }

  isDropdownOpen: boolean = false;
  canToggleDropdown: boolean = true;

  toggleDropdown(): void {
    if (this.canToggleDropdown) {
      this.isDropdownOpen = !this.isDropdownOpen;
      this.canToggleDropdown = false;
      setTimeout(() => {
        this.canToggleDropdown = true;
        this.isDropdownOpen = false;
      }, 3000);
    }
  }

  closeDropdown(): void {

  }

  gotoMySub(): void {

  }
}
