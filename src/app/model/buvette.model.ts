export interface IBuvette {
  id?: string;
  date?: Date;
  price?: Number;
  userName?: String;
  comment?: String;
}

export class Buvette implements IBuvette {
  constructor(
    public id?: string,
    public date?: Date,
    public price?: Number,
    public userName?: String,
    public comment?: String
  ) {}
}
