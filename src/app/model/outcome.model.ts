export interface IOutcome {
  id?: string;
  date?: Date;
  year?: Number;
  month?: Number;
  day?: Number;
  amount?: Number;
  userName?: String;
  description?: String;
}

export class Outcome implements IOutcome {
  constructor(
    public id?: string,
    public date?: Date,
    public year?: Number,
    public month?: Number,
    public day?: Number,
    public amount?: Number,
    public userName?: String,
    public description?: String
  ) {}
}
