export interface UserModel{
    id?:number| null;
    userName?:string| null;
    name?:string| null;
    password?:string| null;
    email?:string| null;
    phone?: number | null;
}


export class User {
    id: number | null;
    
  
    constructor(init?: Partial<User>) {
      this.id = init?.id ?? null;
    }
  }
  