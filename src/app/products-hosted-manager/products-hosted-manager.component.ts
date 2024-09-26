import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ProductHostedInfo } from '../entities/productHostedInfo';
import { HttpErrorResponse } from "@angular/common/http";
import { ProductsService } from "../services/products/products.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../header/header.component";
import { KeycloakOperationService } from "../services/keycloak.service";
import { jwtDecode } from "jwt-decode";
import {Message} from "../entities/message";
import {MatButton} from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-products-hosted-manager',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HeaderComponent,
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    MatIcon,
    RouterLink,
    MatCardModule
  ],
  templateUrl: './products-hosted-manager.component.html',
  styleUrl: './products-hosted-manager.component.css'
})
export class ProductsHostedManagerComponent implements OnInit {
  productHostedInfos: ProductHostedInfo[] = [];
  expandedCardId: number | null = null;
  showPassword: boolean = false;
  newUsers: { [key: number]: string } = {};
  newPasswords: { [key: number]: string } = {};
  showContent: boolean = false;

  showPopup = false;
  changesCompleted = false;
  popupMessage = '';

  email!:string | null;

  userProfile: any | null = null;



  constructor(private productsService: ProductsService, private keyCloakService: KeycloakOperationService) { }

  async ngOnInit() {
    if (this.keyCloakService.isLogged()) {
      try {
        await this.setUserProfile();
        this.email = this.getUserName();
        if (this.email) {
          this.loadProductsHostedInfo(this.email);
        } else {

        }
      } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
      }
    } else {
      window.location.assign("http://localhost:4200");
    }

    this.startInterval()
  }

  private intervalId: any;

  startInterval() {
    this.intervalId = setInterval(() => {
      this.updateMessages();
    }, 500);
  }

  @ViewChild('chatMessages') private chatMessagesDiv!: ElementRef;


  private scrollToBottom(): void {
    try {
      this.chatMessagesDiv.nativeElement.scrollTop = this.chatMessagesDiv.nativeElement.scrollHeight;
    } catch(err) { }
  }
  updateMessages() {
    if (this.expandedCardId != null) {
      this.productsService.getMessagesByProductHostedInfo(this.expandedCardId.toString())
        .subscribe({
          next: (responseMessage) => {
            this.messages = responseMessage.object;

            console.log(this.messages);
            this.scrollToBottom();
          },
          error: (e) => {
            const errorHttp: HttpErrorResponse = e;
            console.error('Errore nell\'aggiornamento dei messaggi:', errorHttp.error.message);
          }
        });
    }
    this.chatMessagesDiv.nativeElement.scrollTop = this.chatMessagesDiv.nativeElement.scrollHeight;


  }

  async setUserProfile() {
    try {
      const token = await this.keyCloakService.getToken();
      const decodedToken = jwtDecode(token);
      this.userProfile = decodedToken;
      console.log('Profilo utente decodificato:', this.userProfile['email']);
    } catch (error) {
      console.error('Errore durante la decodifica del token:', error);
      throw error;
    }
  }

  getUserName(): string | null {
    return this.userProfile ? this.userProfile['email'] : null;
  }

  loadProductsHostedInfo(email: string) {
    this.productsService.getProductsHostedInfoByEmail(email)
      .subscribe({
        next: (responseMessage) => {
          this.productHostedInfos = responseMessage.object;
          this.initializeNewUsersAndPasswords();
          console.log(this.productHostedInfos);
          if(this.productHostedInfos.length > 0){
            this.showContent = true;
          }
        },
        error: (e: HttpErrorResponse) => {
          console.error(e.error.message);
        }
      });
  }

  initializeNewUsersAndPasswords() {
    this.productHostedInfos.forEach(info => {
      this.newUsers[info.id] = info.loginUserInformation;
      this.newPasswords[info.id] = info.loginPasswordInformation;
    });
  }

  toggleExpand(id: number) {
    this.expandedCardId = this.expandedCardId === id ? null : id;
  }

  getMonthsOfUse(startDate: number, renewDate: number): number {
    const start = new Date(startDate);
    const renew = new Date(renewDate);
    const diffTime = Math.abs(renew.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 30);
  }

  changeSettings(id: number) {
    const login = this.newUsers[id];
    const password = this.newPasswords[id];

    this.productsService.changeLoginInfo(id, login, password)
      .subscribe({
        next: (responseMessage) => {
          console.log(responseMessage.message);
        },
        error: (e) => {
          var errorHttp: HttpErrorResponse = e;
          console.log(errorHttp.error.message);
        }
      });

    this.popUpActivate()

  }

  popUpActivate(){
    this.showPopup = true;
    this.changesCompleted = true;
    this.popupMessage = 'Cambiamenti salvati con successo!';
    setTimeout(() => {
      this.showPopup = false;
    }, 1000);
  }

  continueToHost(index: number){

    this.productsService.changeContinueToHost(index)
      .subscribe({
        next: (responseMessage) =>{
          console.log(responseMessage);
        },
        error: (e) =>{
          var errorHttp:HttpErrorResponse=e;
          console.log(errorHttp.error.message);
        }
      })
    this.popUpActivate()

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  productColors: { [key: string]: string } = {
    "Netflix": "#E50914",
    "Spotify": "#1DB954",
    "Apple Music": "#f94c57",
    "Disney+": "#2ca9bc",
    "Prime Video": "#1a98ff",
    "OpenAI": "#23a27d",
    "PlayStation": "#00439c",
    "Youtube": "#363636",
    "XBox": "#107c0f",
    "Origins": "#f15a23",
    "Kindle": "#ff0050",
    "GeminiAI": "#ffffff",
    "EA": "#0d1043",
    "Copilot": "#a0d9e0",
    "Claude": "#f0eee5",
  };

  productImages: { [key: string]: string } = {
    "Netflix": "assets/images/NetflixLogo.png",
    "Spotify": "assets/images/SpotifyLogo.png",
    "Apple Music": "assets/images/AppleMusicLogo.png",
    "Disney+": "assets/images/Diney+Logo.png",
    "Prime Video": "assets/images/PrimeVideoLogo.png",
    "OpenAI": "assets/images/OpenAILogo.png",
    "PlayStation": "assets/images/PlayStationLogo.png",
    "Youtube": "assets/images/YoutubeLogo.png",
    "XBox": "assets/images/LogoXBox.png",
    "Origins": "assets/images/OriginsLogo.png",
    "Kindle": "assets/images/KindleLogo.png",
    "GeminiAI": "assets/images/GeminiAI.png",
    "EA": "assets/images/EALogo.png",
    "Copilot": "assets/images/CopilotLogo.png",
    "Claude": "assets/images/ClaudeLogo.png",
  };

  getProductImage(productName: string): string {
    return this.productImages[productName] ;
  }

  messages: Message[] = [];
  newMessage: string = '';

  selectProductHostedInfo(productHostedInfo: ProductHostedInfo) {
    this.productsService.getMessageByProductHosted(productHostedInfo.productHosted.id.toString())
      .subscribe({
        next: (responseMessage) =>{
          this.messages=responseMessage.object;
          console.log(this.messages);
        },
        error: (e) =>{
          var errorHttp:HttpErrorResponse=e;
          console.error(errorHttp.error.message);
        }
      })
  }

  sendMessage(productHostedInfo: ProductHostedInfo) {

    if (this.newMessage) {
      if (this.email != null) {
        this.productsService.sendMessage(productHostedInfo.productHosted.id, this.newMessage, this.email)
          .subscribe({
            next: (responseMessage) => {
              console.log(responseMessage);
            },
            error: (e) => {
              var errorHttp: HttpErrorResponse = e;
              console.log(errorHttp.error.message);
            }
          })
      }
      this.newMessage = '';
    }
  }
}
