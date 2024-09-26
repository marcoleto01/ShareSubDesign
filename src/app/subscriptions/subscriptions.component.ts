import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { ProductHosted } from "../entities/productHosted";
import { ProductsService } from "../services/products/products.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {KeycloakOperationService} from "../services/keycloak.service";
import {jwtDecode} from "jwt-decode";
import {Product} from "../entities/product";

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  constructor(private productsService: ProductsService,
              private keyCloakService: KeycloakOperationService ) { }

  productsHosted: ProductHosted[] = [];
  filteredProducts: ProductHosted[] = [];
  activeFilter: string = '';
  maxPrice: number = 10;
  searchQuery: string = '';



  ngOnInit() {
    this.productsService.getAllProductHosted()
      .subscribe({
        next: (responseMessage) => {
          this.productsHosted = responseMessage.object;
          this.filteredProducts = this.productsHosted;
          console.log(this.productsHosted);
        },
        error: (e) => {
          var errorHttp: HttpErrorResponse = e;
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

  getProductImage(productName: string): string {
    return this.productImages[productName] || 'assets/images/default.png';
  }

  getFormattedDate(timestamp: string): string {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  setFilter(filter: string) {
    this.activeFilter = this.activeFilter === filter ? '' : filter;
  }

  applyFilters() {
    this.productsService.mainSearch(this.searchQuery, this.maxPrice, this.activeFilter)
      .subscribe({
        next: (responseMessage) => {
          this.productsHosted = responseMessage.object;
          this.filteredProducts = this.productsHosted;
          console.log(this.productsHosted);
        },
        error: (e) => {
          var errorHttp: HttpErrorResponse = e;
          alert(errorHttp.error.message);
        }
      })
  }

  search() {
    this.applyFilters();
  }

  proceedToPurchase(product: ProductHosted) {
    console.log('Proceeding to purchase:', product);
    // Implement the purchase logic here
  }

  addSub(product:ProductHosted){
    if(!this.keyCloakService.isLogged()){
      this.keyCloakService.login();
    }
    else{
      window.location.href = 'http://localhost:4200/purchase/'+product.id+'/';
    }
  }


}
