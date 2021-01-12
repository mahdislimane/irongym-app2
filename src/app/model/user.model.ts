export interface IUser {
  id?: String;
  firstName?: String;
  lastName?: String;
  email?: String;
  role?: String;
  password?: String;
  date?: Date;
}

export class User implements IUser {
  constructor(
    public id?: string,
    public firstName?: String,
    public lastName?: String,
    public email?: String,
    public role?: String,
    public password?: String,
    public date?: Date
  ) {}
}
