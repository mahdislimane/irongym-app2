import { Avance } from './avance.model';

export interface ISalary {
  id?: string;
  salary?: Number;
  year?: Number;
  month?: Number;
  rest?: Number;
  avances?: Avance;
}

export class Salary implements ISalary {
  constructor(
    public id?: string,
    public salary?: Number,
    public year?: Number,
    public month?: Number,
    public rest?: Number,
    public avances?: Avance
  ) {}
}
