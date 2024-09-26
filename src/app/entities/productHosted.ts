import {Product} from "./product";
import {User} from "./user";

export class ProductHosted{
  id!:number;
  productAssociated!:Product;
  hostedBy!: User;
  hostingStartDate!:number;
  lastRenewDate!:number;
  continueToHost!:boolean;
  subAvailable!:boolean;
  subUsers!:number;
}
