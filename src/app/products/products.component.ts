import { Component,OnInit  } from '@angular/core';
import {ProductsService} from "../services/products/products.service";
import {Product} from "../entities/product";
import {HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {KeycloakOperationService} from "../services/keycloak.service";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,
    HttpClientModule, RouterLink, HeaderComponent],
  templateUrl:'./products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  constructor(private productsService: ProductsService, private keyCloakService: KeycloakOperationService ) { }

  products: Product[] = [];

  ngOnInit(): void {

    this.productsService.getAll()
      .subscribe({
        next: (responseMessage) =>{
          this.products=responseMessage.object;
          console.log(this.products);
        },
        error: (e) =>{
          var errorHttp:HttpErrorResponse=e;
          alert(errorHttp.error.message);
        }
      })

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

  getProductImage(productName: string): string {
    return this.productImages[productName] ;
  }

  creaProduct(id:number){
    if(!this.keyCloakService.isLogged()){
      this.keyCloakService.login();
    }
    else{
      window.location.href = 'http://localhost:4200//products/'+id+"/";
    }

  }



}
