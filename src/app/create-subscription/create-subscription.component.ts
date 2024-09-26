import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProductsService } from "../services/products/products.service";
import { Product } from "../entities/product";
import { HttpErrorResponse } from "@angular/common/http";
import { MatIconModule } from '@angular/material/icon';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../header/header.component";
import {KeycloakOperationService} from "../services/keycloak.service";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-create-subscription',
  standalone: true,
  imports: [MatIconModule, NgClass, NgForOf, FormsModule, HeaderComponent, NgIf],
  templateUrl: './create-subscription.component.html',
  styleUrl: './create-subscription.component.css'
})
export class CreateSubscriptionComponent implements OnInit {

  constructor(private productsService: ProductsService, private route: ActivatedRoute,
              private keyCloakService: KeycloakOperationService,) { }

  product!: Product;
  today!: Date;
  renewDate!: Date;
  username: string = '';
  password: string = '';
  selectedUserNumber: number = 1;

  numbers: number[] = [];

  emailUser: string = '';

  async ngOnInit() {
    if (this.keyCloakService.isLogged()) {
      try {
        await this.setUserProfile();
        const email = this.getUserName();
        if (email) {
          this.emailUser = email;
          this.getProduct();
        } else {
          console.error('Email non disponibile');
        }
      } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
      }
    }


  }

  getProduct(){
    this.route.params.subscribe(params => {
      const idProduct = params['productId'];
      this.productsService.getById(idProduct)
        .subscribe(
          responseMessage => {
            console.log(responseMessage);
            this.product = responseMessage.object;
            this.today = new Date();
            this.renewDate = new Date(this.today.getTime() + (this.product.renewRate * 24 * 60 * 60 * 1000));
            this.numbers = [...Array(this.product.maxUsers).keys()].map(i => i + 1);
            console.log(this.numbers);
          },
          error => {
            var e: HttpErrorResponse = error;
            alert(e.error.message);
            window.location.assign("http://localhost:4200");
          }
        );
    });
  }

  getUserName(): string | null {
    return this.userProfile ? this.userProfile['email'] : null;
  }

  userProfile: any | null = null;
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
    return this.productImages[productName];
  }


  getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Formatta come YYYY-MM-DD
  }

  selectUserNumber(num: number) {
    this.selectedUserNumber = num;
  }


  showPopup: boolean = false;
  popupMessage: string = '';
  purchaseCompleted: boolean = false;

  createProductHosted() {



    this.productsService.createProductHosted(this.product.id.toString(),
      this.emailUser,
      this.selectedUserNumber.toString(),
      this.username,
      this.password)
      .subscribe({
        next: responseMessage => {
          console.log("ProductHosted Createad");
        },
        error: error => {
          var e: HttpErrorResponse = error;
          console.log(e);
        }
      });

    const delay = 1500;
    this.purchaseCompleted = true;
    this.popupMessage = 'Hai creato un abbonamento!';
    this.showPopup = true;
    setTimeout(() => {
      setTimeout(() => {
        this.showPopup = false;
      },2000);
      window.location.href = 'http://localhost:4200/manageHostedProducts';
    }, delay);
  }






  protected readonly Array = Array;
}
