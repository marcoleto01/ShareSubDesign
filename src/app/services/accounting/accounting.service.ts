import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ResponseMessage} from "../../entities/ResponseMessage";
import {User} from "../../entities/user";

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  private AccountingUri="http://localhost:8181/users";

  constructor(private http:HttpClient) { }

  public getUserByEmail(email:string){
    return this.http.get<ResponseMessage>(this.AccountingUri+'/findByEmail?email='+email, {});
  }

  public registerUserByString(email:string, first_name:string, last_name:string){
    return this.http.post<ResponseMessage>(this.AccountingUri+'/registerUserByString?email='+email+'&first_name='+first_name+'&last_name='+last_name,{});
  }

  public createUser(users: User[]){
    return this.http.post<ResponseMessage>(this.AccountingUri+'/createUser', users);
  }

  public getAll(){
    return this.http.get<ResponseMessage>(this.AccountingUri+'/getAll', {});
  }

  public getBalance(email:string){
    return this.http.get<ResponseMessage>(this.AccountingUri+'/getBalance?email='+email, {});
  }

  public redeemBalance(email:string, amount:number){
    return this.http.post<ResponseMessage>(this.AccountingUri+'/redeemBalance?email='+email+'&amount='+amount,{});
  }

}
