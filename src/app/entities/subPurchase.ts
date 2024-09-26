import { Product } from "./product";
import {User} from "./user";


export class SubPurchase{
  id!:number;
  price!:number;
  purchaseTime!:number;
  buyer!: User;
  product!: Product;
}
