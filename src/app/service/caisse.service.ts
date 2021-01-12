import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class CaisseService {
  constructor(protected http: HttpClient) {}
  configuration = {
    headers: {
      'x-auth-token': localStorage.getItem('x-auth-token'),
    },
  };

  getIncome() {
    return this.http.get(
      environment.URL + 'api/caisse/income',
      this.configuration
    );
  }

  addIncome(caisse) {
    return this.http.post(
      environment.URL + 'api/caisse/income',
      caisse,
      this.configuration
    );
  }

  deleteIncome(id) {
    return this.http.delete(
      environment.URL + 'api/caisse/income/' + id,
      this.configuration
    );
  }

  getOutcome() {
    return this.http.get(
      environment.URL + 'api/caisse/outcome',
      this.configuration
    );
  }

  addOutcome(caisse) {
    return this.http.post(
      environment.URL + 'api/caisse/outcome',
      caisse,
      this.configuration
    );
  }

  deleteOutcome(id) {
    return this.http.delete(
      environment.URL + 'api/caisse/outcome/' + id,
      this.configuration
    );
  }
}
