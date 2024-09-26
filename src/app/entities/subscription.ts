import {User} from "./user";
import {ProductHostedInfo} from "./productHostedInfo";

export class Subscription{
  id!:number;
  user!:User;
  productHostedInfo!:ProductHostedInfo;
  renew!:boolean
}
