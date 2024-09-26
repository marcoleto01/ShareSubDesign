import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {ProductsService} from "../services/products/products.service";
import {Subscription} from "../entities/subscription";
import {Message} from "../entities/message";
import {HeaderComponent} from "../header/header.component";
import {CommonModule} from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {KeycloakOperationService} from "../services/keycloak.service";
import {jwtDecode} from "jwt-decode";


@Component({
  selector: 'app-my-sub',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    HeaderComponent
  ],
  templateUrl: './my-sub.component.html',
  styleUrl: './my-sub.component.css'
})
export class MySubComponent implements OnInit {

  constructor(private productsService: ProductsService,
              private keyCloakService: KeycloakOperationService) { }

  subscriptions: Subscription[] = [];
  messages: Message[] = [];
  selectedSubscription: Subscription | null = null;
  newMessage: string = '';
  showPassword: boolean = false;
  renewValue: boolean = false;
  private intervalId: any;

  showPopup = false;
  changesCompleted = false;
  popupMessage = '';

  userProfile: any | null = null;

  noElement:boolean=false;


  newDate!: Date;





  async ngOnInit() {
    if(this.keyCloakService.isLogged()) {
      try {
        await this.setUserProfile();
        const email = this.getUserName();
        if (email) {
          this.loadSubscriptions(email);
        } else {
          console.error('Email non disponibile');
        }
      } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
      }
    }

  }

  public loadSubscriptions(email: string) {
    this.productsService.getSubscription(email)
      .subscribe({
        next: (responseMessage) =>{
          this.subscriptions=responseMessage.object;
          console.log(this.subscriptions);
          if(this.subscriptions.length==0){
            this.noElement=true;

          }
        },
        error: (e) =>{
          var errorHttp:HttpErrorResponse=e;
          console.error(errorHttp.error.message);
        }
      })
    this.startInterval();
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

  getUserName(): string {
    return this.userProfile ? this.userProfile['email'] : null;
  }

  popUpActivate(){
    this.showPopup = true;
    this.changesCompleted = true;
    this.popupMessage = 'Cambiamenti salvati con successo!';
    setTimeout(() => {
      this.showPopup = false;
    }, 1000);
  }


  startInterval() {
    this.intervalId = setInterval(() => {
      this.updateMessages();
    }, 500);
  }

  selectSubscription(subscription: Subscription) {
    if(this.selectedSubscription == null){
      this.selectedSubscription = subscription;
      this.productsService.getMessageByProductHosted(subscription.productHostedInfo.productHosted.id.toString())
        .subscribe({
          next: (responseMessage) =>{
            this.messages=responseMessage.object;
            console.log(this.messages);
            this.newDate= new Date(subscription.productHostedInfo.productHosted.lastRenewDate.toString() )
            console.log(this.newDate)
            this.newDate.setDate(this.newDate.getDate()+subscription.productHostedInfo.productHosted.productAssociated.renewRate)
            console.log(this.newDate)
          },
          error: (e) =>{
            var errorHttp:HttpErrorResponse=e;
            console.error(errorHttp.error.message);
          }
        })
    }
    else{
      this.selectedSubscription = null;
    }
  }

  renewSubscription() {
    if (this.selectedSubscription) {
      console.log(this.selectedSubscription.id);
      this.productsService.renewSubscription(this.selectedSubscription.id)
        .subscribe({
          next: (responseMessage) =>{
            console.log(responseMessage);
          },
          error: (e) =>{
            var errorHttp:HttpErrorResponse=e;
            console.error(errorHttp.error.message);
          }
        })

      this.popUpActivate()
    }
  }

  updateMessages() {
    if (this.selectedSubscription) {
      this.productsService.getMessageByProductHosted(this.selectedSubscription.productHostedInfo.productHosted.id.toString())
        .subscribe({
          next: (responseMessage) => {
            this.messages = responseMessage.object;
            console.log(this.messages);
          },
          error: (e) => {
            const errorHttp: HttpErrorResponse = e;
            console.error('Errore nell\'aggiornamento dei messaggi:', errorHttp.error.message);
          }
        });
    }
  }

  sendMessage() {

    console.log(this.selectedSubscription?.productHostedInfo.productHosted.id, this.newMessage);
    if (this.selectedSubscription && this.newMessage) {
      this.productsService.sendMessage(this.selectedSubscription.productHostedInfo.productHosted.id, this.newMessage, this.getUserName())
        .subscribe({
          next: (responseMessage) =>{
            console.log(responseMessage);
          },
          error: (e) =>{
            var errorHttp:HttpErrorResponse=e;
            console.log(errorHttp.error.message);
          }
        })
      this.newMessage = '';
    }
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

  getProductColor(productName: string): string {
    return this.productColors[productName] ;
  }


  getFormattedDate(data: number): string {
    const d= new Date(data);

    return d.toISOString().split('T')[0]; // Formatta come YYYY-MM-DD
  }

  getProductImage(productName: string): string {
    return this.productImages[productName] ;
  }

  getMonthsOfUse(data: number, renewDate: number): string {
    const newMillisec = data+ 1000 * 60 * 60 * 24 * renewDate;
    const d = new Date(newMillisec);
    return d.toISOString().split('T')[0]; // Formatta come YYYY-MM-DD
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  copyPassword() {
    if (this.selectedSubscription) {
      navigator.clipboard.writeText(this.selectedSubscription.productHostedInfo.loginPasswordInformation)
        .then(() => {
          alert('Password copied to clipboard');
        })
        .catch(err => {
          console.error('Error copying password: ', err);
        });
    }
  }




}
