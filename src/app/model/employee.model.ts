import { Salary } from './salary.model';

export interface IEmployee {
  id?: string;
  fullName?: String;
  jobTitle?: String;
  phoneNumber?: String;
  cin?: string;
  startDate?: Date;
  salarys?: Salary;
  endDate?: Date;
}

export class Employee implements IEmployee {
  constructor(
    public id?: string,
    public fullName?: String,
    public jobTitle?: String,
    public phoneNumber?: String,
    public cin?: string,
    public startDate?: Date,
    public salarys?: Salary,
    public endDate?: Date
  ) {}
}
