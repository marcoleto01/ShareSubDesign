import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubpurchaseService } from "../services/subpurchase/subpurchase.service";
import { AccountingService } from "../services/accounting/accounting.service";
import { jwtDecode } from "jwt-decode";
import { KeycloakOperationService } from "../services/keycloak.service";
import { SubPurchase } from "../entities/subPurchase";
import { HeaderComponent } from "../header/header.component";
import { Chart, ChartConfiguration } from 'chart.js/auto';
import {CommonModule} from "@angular/common";
import {User} from "../entities/user";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-my-purchase',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './my-purchase.component.html',
  styleUrl: './my-purchase.component.css'
})
export class MyPurchaseComponent implements OnInit {
  @ViewChild('pieChart') pieChartCanvas!: ElementRef;


  constructor(private subPurchaseService: SubpurchaseService,
              private accountService: AccountingService,
              private keyCloakService: KeycloakOperationService) { }

  subPurchases: SubPurchase[] = [];
  nPurchase: number=0;
  totalSpent: number = 0;
  pieChart: Chart | undefined;
  user!: User;
  balance!: number;
  redeemValue!: number;

  showPopup = false;
  redeemFailed = false;
  popupMessage = '';
  purchaseAvailable:boolean = false;




  async ngOnInit() {
    if (this.keyCloakService.isLogged()) {
      try {
        await this.setUserProfile();
        const email = this.getUserName();
        if (email) {
          this.getSubPurchaseByUser(email);
          this.createPieChart();
        } else {
          console.error('Email non disponibile');
        }
      } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
      }
    }
    else{
      window.location.href = 'http://localhost:4200';
    }
  }

  redeemBalance() {
    if (this.redeemValue) {
      if(this.redeemValue < 0 || this.redeemValue > this.user.balance){
        this.popUpActivate();
        return;
      }
      else{
        console.log('Redeeming balance...');
        this.accountService.redeemBalance(this.user.email, this.redeemValue)
          .subscribe({
            next: (responseMessage) => {
              console.log(responseMessage);
              this.redeemValue = 0;
              window.location.reload();
            },
            error: (e) => {
              console.error('Errore:', e);
            }
          });
      }

    }

  }

  popUpActivate(){
    this.showPopup = true;
    this.redeemFailed = true;
    this.popupMessage = 'Importo non valido!';
    setTimeout(() => {
      this.showPopup = false;
    }, 1000);
  }



  getSubPurchaseByUser(email: string) {
    this.subPurchaseService.getSubPurchaseByUser(email).subscribe(
      (response) => {
        this.subPurchases = response.object;
        if(this.subPurchases.length > 0){
          this.purchaseAvailable = true;
          this.nPurchase = this.subPurchases.length;
          this.calculateTotalSpent();
          this.updatePieChart();
        }

      },
      (error) => {
        console.error('Errore:', error);
      }
    );
    this.accountService.getAll()
      .subscribe({
        next: (responseMessage) => {
          const users: User[] = responseMessage.object;
          this.user = users.find(user => user.email === email)!;
          this.balance = this.user.balance;
        }
      });
  }

  calculateTotalSpent() {
    this.totalSpent = this.subPurchases.reduce((total, purchase) => total + purchase.price, 0);
  }

  createPieChart() {
    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    // @ts-ignore
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: []
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Distribuzione delle Spese per Tipo di Prodotto'
          }
        }
      }
    });
  }

  updatePieChart() {
    if (!this.pieChart) return;

    const typeTotal: { [key: string]: number } = {};
    this.subPurchases.forEach(purchase => {
      const type = purchase.product.type;
      typeTotal[type] = (typeTotal[type] || 0) + purchase.price;
    });

    const labels = Object.keys(typeTotal);
    const data = Object.values(typeTotal);
    const backgroundColor = labels.map(label => this.productColors[label] || this.getRandomColor());

    this.pieChart.data.labels = labels;
    this.pieChart.data.datasets[0].data = data;
    this.pieChart.data.datasets[0].backgroundColor = backgroundColor;
    this.pieChart.update();
  }

  getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
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

  getUserName(): string | null {
    return this.userProfile ? this.userProfile['email'] : null;
  }

  getFormattedDate(timestamp: string): string {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

}
