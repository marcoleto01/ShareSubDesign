import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../../entities/product";
import {ResponseMessage} from "../../entities/ResponseMessage";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubpurchaseService {

  private apiUrl = 'http://localhost:8181/products'; // Base URL dell'API

  constructor(private http: HttpClient) { }

  addSubscription(productHostedId: string, email: string, payWithBalance: boolean): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(this.apiUrl + "/subscription/addSubscription?productHostedId="+productHostedId+"&email="+email+"&payWithBalance="+payWithBalance, {});
  }


  getSubPurchaseByUser(email: string){
    return this.http.get<ResponseMessage>('http://localhost:8181/purchasing' + '/by_buyer?email='+email, {});
  }

  getAllSubPurchase(){
    return this.http.get<ResponseMessage>(this.apiUrl + '/getSubPurchase', {});
  }
}
