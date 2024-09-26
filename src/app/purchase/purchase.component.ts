import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import {HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import { ProductsService } from "../services/products/products.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import { ProductHosted } from "../entities/productHosted";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {SubpurchaseService} from "../services/subpurchase/subpurchase.service";
import { FormsModule } from '@angular/forms';
import {KeycloakOperationService} from "../services/keycloak.service";
import {jwtDecode} from "jwt-decode";
import {AccountingService} from "../services/accounting/accounting.service";
import {CreateSubscriptionComponent} from "../create-subscription/create-subscription.component";

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  standalone: true,
  imports: [CommonModule,
    HttpClientModule, RouterLink, HeaderComponent, FormsModule],
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  productHosted!: ProductHosted;
  showCardDetails: boolean = false;
  showPopup: boolean = false;
  purchaseCompleted: boolean = false;
  popupMessage: string = 'Acquisto in corso';
  payWithBalance: boolean = false;

  renewDate: Date = new Date();

  newPrice!: number;

  constructor(
    private productsService: ProductsService,
    private subPurchaseService: SubpurchaseService,
    private accountService: AccountingService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private el: ElementRef,
    private keyCloakService: KeycloakOperationService
  ) { }

  async ngOnInit() {
    if (this.keyCloakService.isLogged()) {
      try {
        await this.setupEmail();
        if (this.email) {
          this.getBalance();
          this.getProductInfo();
          this.toggleCardDetails(true);
        }
      } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
      }
    } else {
      this.keyCloakService.login();
    }
  }

  alreadyBuyed: boolean = false;

  checkSubNotAlreadyBought()  {
    this.productsService.productHostedAlreadyBuyed(
      this.email,
      this.productHosted.id
    ).subscribe({
      next: responseMessage => {
        this.alreadyBuyed = responseMessage.object;
      },
      error: error => {

      }
    });
  }

  email:string = '';
  userProfile: any | null = null;

  getProductInfo(){
    this.route.params.subscribe(params => {
      const idProduct = params['productHostedId'];
      this.productsService.getProductHostedById(idProduct)
        .subscribe(
          responseMessage => {
            console.log(responseMessage);
            this.productHosted = responseMessage.object;
            this.renewDate = new Date(new Date().getTime() + (this.productHosted.productAssociated.renewRate * 24 * 60 * 60 * 1000));;

          },
          error => {
            var e: HttpErrorResponse = error;
            window.location.assign("http://localhost:4200");
          }
        );
    });
  }

  balance!: number;

  getBalance(){
    this.accountService.getBalance(this.email)
      .subscribe({
        next: responseMessage => {
          this.balance = responseMessage.object
        },
        error: error => {
          var e: HttpErrorResponse = error;
          console.error("Error retrieving balance:", e);
        }
      })
  }

  async setupEmail() {
    try {
      const token = await this.keyCloakService.getToken();
      const decodedToken = jwtDecode(token);
      this.userProfile = decodedToken;
      this.email = this.userProfile['email'];
    } catch (error) {
      console.error('Errore durante la decodifica del token:', error);
      throw error;
    }
  }


  getProductColor(productName: string): string {
    return this.productColors[productName] || '#000000';
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
    return this.productImages[productName] || 'assets/images/default.png';
  }

  toggleCardDetails(show: boolean) {
    this.showCardDetails = show;
    this.payWithBalance = !show;
  }

  checkProductPrice(){
    this.productsService.checkProductPrice(
      this.productHosted.id,
      this.newPrice
    ).subscribe({
      next: responseMessage => {
        this.newPrice = responseMessage.object;
      }
    });
  }



  completePurchase() {

    this.checkSubNotAlreadyBought();
    this.checkProductPrice();
    setTimeout(() => {
      if( this.alreadyBuyed){
        this.sameEmail = true;
        this.showPopupError = true;
        this.popupMessageError = 'Hai già acquistato questo prodotto!';
        setTimeout(() => {
          this.showPopupError = false;
        }, 3000);
        return;
      }

      if(this.newPrice != this.productHosted.productAssociated.pricePerUser){
        this.sameEmail = true;
        this.showPopupError = true;
        this.popupMessageError = 'Il prezzo è variato!';
        setTimeout(() => {
          window.location.href = 'http://localhost:4200/purchase/' + this.productHosted.id;
        }, 3000);
        return;
      }

      if(this.email == this.productHosted.hostedBy.email){
        this.sameEmail = true;
        this.showPopupError = true;
        this.popupMessageError = 'Non puoi comprare i tuoi prodotti!';
        setTimeout(() => {
          this.showPopupError = false;
        }, 3000);
        return;
      }
      this.showPopup = true;
      this.purchaseCompleted = false;
      this.popupMessage = 'Acquisto in corso';

      this.addSubscription();

      setTimeout(() => {
        this.purchaseCompleted = true;
        this.popupMessage = 'Acquisto completato';

        setTimeout(() => {
          this.showPopup = false;

          setTimeout(() => {
            this.startSplashEffect();
            setTimeout(() => {
              window.location.href = 'http://localhost:4200/mySub';
            },2000);
          }, 0  );
        }, 1000);
      }, 1800);

    }, 200);
  }

  private startSplashEffect() {
    const button = this.el.nativeElement.querySelector('button');
    if (button) {
      this.renderer.setStyle(button, 'opacity', '0');
      setTimeout(() => {
        this.renderer.setStyle(button, 'display', 'none');
      }, 300);
    }

    const baseColor = this.getProductColor(this.productHosted.productAssociated.name);
    const colors = [baseColor, this.lightenColor(baseColor, 10), this.lightenColor(baseColor, 20), this.lightenColor(baseColor, 30)];
    const totalSplashes = 10;

    for (let i = 0; i < totalSplashes; i++) {
      this.createSplash(colors[i % colors.length], i * 150);
    }
  }

  private createSplash(color: string, delay: number) {
    const splash = this.renderer.createElement('div');
    this.renderer.addClass(splash, 'splash');
    this.renderer.setStyle(splash, 'backgroundColor', color);

    const size = Math.max(window.innerWidth, window.innerHeight) * 2.5;
    this.renderer.setStyle(splash, 'width', `${size}px`);
    this.renderer.setStyle(splash, 'height', `${size}px`);

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    this.renderer.setStyle(splash, 'left', `${x - size/2}px`);
    this.renderer.setStyle(splash, 'top', `${y - size/2}px`);

    this.renderer.appendChild(this.el.nativeElement, splash);

    setTimeout(() => {
      this.renderer.setStyle(splash, 'transform', 'scale(1)');
    }, delay);

    setTimeout(() => {
      this.renderer.removeChild(this.el.nativeElement, splash);
    }, delay + 1500);
  }

  private lightenColor(color: string, amount: number): string {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  sameEmail: boolean = false;
  popupMessageError: string = 'Non puoi comprare i tuoi prodotti!';
  showPopupError: boolean = false;


  addSubscription() {
    this.setupEmail();
    this.subPurchaseService.addSubscription(
      this.productHosted.id.toString(),
      this.email,
      this.payWithBalance
    ).subscribe({
      next: responseMessage => {
        console.log("Subscription added successfully");
      },
      error: error => {
        var e: HttpErrorResponse = error;
        console.error("Error adding subscription:", e);
      }
    });
  }

  protected readonly CreateSubscriptionComponent = CreateSubscriptionComponent;
}
