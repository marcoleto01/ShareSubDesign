import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ResponseMessage} from "../../entities/ResponseMessage";
import {Product} from "../../entities/product";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private ProductsUri="http://localhost:8181/products";

  constructor(private http:HttpClient ) {}

  public getAll(){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/getAll', {});
  }

  public getAllProductHosted(){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/getAllProductHosted', {});
  }

  public getById(id:string){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/search/by_id?id='+id, {});
  }

  public getProductHostedById(id:string){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/search/by_id_productHosted?id='+id, {});
  }

  public createProductHosted(idProduct: string,
                             email:string,
                             subUsers:string,
                             loginInfo:string,
                             password:string){
    return this.http.post<ResponseMessage>(this.ProductsUri+'/crea_productHosted?productId='+idProduct+'&email='+email+'&subUsers='+subUsers+'&loginInfo='+loginInfo+'&password='+password,{});
  }

  public getProductsHostedInfoByEmail(email:string){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/productHostedInfo/getByUser?email='+email, {});
  }

  public getSubscription(email : string){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/subscription/get?email='+email, {});
  }

  public getMessageByProductHosted(id:string){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/message/getMessagesByProductHosted?productHostedId='+id, {});
  }

  public getMessagesByProductHostedInfo(id: string) {
    return this.http.get<ResponseMessage>(this.ProductsUri + '/message/getMessagesByProductHostedInfo?productHostedInfoId=' + id, {});
  }


  public changeLoginInfo(id: number, login: string, password: string) {
    return this.http.put<ResponseMessage>(this.ProductsUri + '/productHostedInfo/changeLoginInfo?productHostedInfoId=' + id + '&newLoginInfo=' + login + '&newLoginPassword=' + password, {});

  }

  public changeContinueToHost(id:number){
    return this.http.put<ResponseMessage>(this.ProductsUri+'/productHosted/changeContinueToHost?id='+id, {});
  }

  public renewSubscription(id:number){
    return this.http.put<ResponseMessage>(this.ProductsUri+'/subscription/renewSubscription?id='+id,{});
  }

  public mainSearch(name:string, maxPrice:number, type: string){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/search/pByNameTypePriceLower?name='+ name +'&type='+ type +'&price=' + maxPrice, {});
  }

  public sendMessage(id: number, message: string, email: string) {
    return this.http.post<ResponseMessage>(this.ProductsUri + '/message/createMessage?productHostedId=' + id + '&text=' + message+"&email="+email, {});
  }

  public productHostedAlreadyBuyed(email: string, productHostedId: number){
    return this.http.get<ResponseMessage>(this.ProductsUri+'/subscription/subscriptionAlreadyExists?productHostedId='+productHostedId+"&email="+email, {});

  }

  public checkProductPrice(id: number, price: number) {
    return this.http.get<ResponseMessage>(this.ProductsUri + '/getProductPricePerUser?productHostedId=' + id + '&price=' + price, {});
  }

  public updateAll(){
    return this.http.post<ResponseMessage>(this.ProductsUri+'/subscription/updateAll', {});
  }






}
