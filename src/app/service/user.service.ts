import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IUser } from '../model/user.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  constructor(protected http: HttpClient) {}
  configuration = {
    headers: {
      'x-auth-token': localStorage.getItem('x-auth-token'),
    },
  };

  getUserLogedIn() {
    return this.http.get(environment.URL + 'api/auth', this.configuration);
  }

  getAllUsers() {
    return this.http.get<IUser[]>(
      environment.URL + 'api/auth/allusers',
      this.configuration
    );
  }

  getUser(id) {
    return this.http.get(
      environment.URL + 'api/auth/user/' + id,
      this.configuration
    );
  }

  addUser(user) {
    return this.http.post(
      environment.URL + 'api/user',
      user,
      this.configuration
    );
  }

  loginUser(user) {
    return this.http.post(environment.URL + 'api/auth', user);
  }

  logoutUser(id) {
    return this.http.put(
      environment.URL + 'api/auth/' + id,
      this.configuration
    );
  }

  deleteUser(id) {
    return this.http.delete(
      environment.URL + 'api/user/' + id,
      this.configuration
    );
  }

  editUser(user) {
    return this.http.put(
      environment.URL + 'api/user/edituser',
      user,
      this.configuration
    );
  }
}
