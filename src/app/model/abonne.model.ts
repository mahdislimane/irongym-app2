import { Abonnement } from './abonnement.model';

export interface IAbonne {
  id?: String;
  userLogedIn?: String;
  firstName?: String;
  lastName?: String;
  phoneNumber?: String;
  credit?: Number;
  abonnements?: Abonnement[];
}

export class Abonne implements IAbonne {
  constructor(
    public id?: string,
    public userLogedIn?: String,
    public firstName?: String,
    public lastName?: String,
    public phoneNumber?: String,
    public credit?: Number,
    public abonnements?: Abonnement[]
  ) {}
}
