export interface IIncome {
  id?: string;
  date?: Date;
  year?: Number;
  month?: Number;
  day?: Number;
  amount?: Number;
  userName?: String;
}

export class Income implements IIncome {
  constructor(
    public id?: string,
    public date?: Date,
    public year?: Number,
    public month?: Number,
    public day?: Number,
    public amount?: Number,
    public userName?: String
  ) {}
}
