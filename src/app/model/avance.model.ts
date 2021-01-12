export interface IAvance {
  id?: string;
  date?: Date;
  year?: Number;
  month?: Number;
  amount?: Number;
}

export class Avance implements IAvance {
  constructor(
    public id?: string,
    public date?: Date,
    public year?: Number,
    public month?: Number,
    public amount?: Number
  ) {}
}
