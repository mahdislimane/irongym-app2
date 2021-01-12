export interface IAbonnement {
  id?: String;
  departement?: String;
  abType?: String;
  price?: Number;
  pay?: Number;
  date?: Date;
  presences?: Date[];
}

export class Abonnement implements IAbonnement {
  constructor(
    public id?: string,
    public departement?: String,
    public abType?: String,
    public price?: Number,
    public pay?: Number,
    public date?: Date,
    public presences?: Date[]
  ) {}
}
