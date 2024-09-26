import {Chat} from "./chat";
import {User} from "./user";

export class Message{
  id!:number;
  chat!:Chat;
  content!:string;
  sender!: User;
  date!:number;
}
